import { Router } from "express";
import { client } from "store/client";
import { authMiddleware } from "../middleware";

const router = Router();

// Redis group management
router.post("/redis/create-group/:regionId", authMiddleware, async (req, res) => {
  try {
    const regionId = req.params.regionId;
    
    if (!regionId) {
      return res.status(400).json({ error: "Region ID is required" });
    }
    
    // Verify region exists
    const region = await client.region.findUnique({
      where: { id: regionId }
    });

    if (!region) {
      return res.status(404).json({ error: "Region not found" });
    }

    const { xCreateGroup } = await import("redisstream/client");
    await xCreateGroup(regionId);
    
    res.json({ 
      message: `Redis consumer group created for region '${region.name}' (${regionId})`,
      regionId: regionId,
      regionName: region.name
    });
  } catch (error) {
    console.error("Redis group creation error:", error);
    res.status(500).json({ error: "Failed to create Redis group" });
  }
});

// Trigger pusher to add websites to queue
router.post("/trigger-pusher", authMiddleware, async (req, res) => {
  try {
    // Import the pusher function dynamically
    const { xAddBulk } = await import("redisstream/client");
    
    // Get user's websites that haven't been checked yet (no ticks)
    const uncheckedWebsites = await client.website.findMany({
      where: { 
        userId: req.userId,
        ticks: {
          none: {} // Only websites with no monitoring ticks
        }
      },
      include: {
        ticks: true
      }
    });

    // Get total websites count for comparison
    const totalWebsites = await client.website.count({
      where: { userId: req.userId }
    });

    if (uncheckedWebsites.length === 0) {
      if (totalWebsites === 0) {
        return res.json({ 
          message: "No websites found. Add some websites first!",
          count: 0,
          total: 0
        });
      } else {
        return res.json({ 
          message: `All ${totalWebsites} websites have already been checked. Add new websites to monitor more!`,
          count: 0,
          total: totalWebsites,
          unchecked: 0
        });
      }
    }

    // Add only unchecked websites to Redis queue
    await xAddBulk(uncheckedWebsites.map((w) => ({ url: w.url, id: w.id })));
    
    res.json({ 
      message: `Successfully pushed ${uncheckedWebsites.length} new websites to monitoring queue (${totalWebsites - uncheckedWebsites.length} already monitored)`,
      count: uncheckedWebsites.length,
      total: totalWebsites,
      unchecked: uncheckedWebsites.length
    });
  } catch (error) {
    console.error("Pusher trigger error:", error);
    res.status(500).json({ error: "Failed to trigger pusher" });
  }
});

// Trigger worker to process queue
router.post("/trigger-worker", authMiddleware, async (req, res) => {
  try {
    const { regionId, workerId } = req.body;

    // Validate input
    if (!regionId || !workerId) {
      return res.status(400).json({ 
        error: "Region ID and Worker ID are required" 
      });
    }

    // Verify region exists
    const region = await client.region.findUnique({
      where: { id: regionId }
    });

    if (!region) {
      return res.status(404).json({ error: "Region not found" });
    }

    // Import Redis functions dynamically
    const { xReadGroup, xAckBulk } = await import("redisstream/client");
    const axios = await import("axios");

    // Read from the stream using the provided region and worker IDs
    const response = await xReadGroup(regionId, workerId);
    
    if (!response || response.length === 0) {
      return res.json({ 
        message: `No websites in queue for region '${region.name}' to process`,
        processed: 0,
        regionName: region.name 
      });
    }

    // Process websites
    let processed = 0;
    for (const { message } of response) {
      try {
        // Check if website exists
        const website = await client.website.findUnique({
          where: { id: message.id }
        });
        
        if (!website) {
          console.log(`Website ${message.id} not found, skipping...`);
          continue;
        }

        // Check website status
        const startTime = Date.now();
        try {
          // Normalize URL - add protocol if missing
          let normalizedUrl = message.url;
          if (!message.url.startsWith('http://') && !message.url.startsWith('https://')) {
            normalizedUrl = `https://${message.url}`;
          }
          
          await axios.default.get(normalizedUrl, { 
            timeout: 30000, // Increased to 30 seconds
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; UpTime-Monitor/1.0)'
            },
            maxRedirects: 3,
            // Remove custom validateStatus for now
          });
          const endTime = Date.now();
          
          await client.websiteTick.create({
            data: {
              response_time_ms: endTime - startTime,
              status: "Up",
              region_id: regionId,
              website_id: message.id,
            },
          });
        } catch (error: any) {
          const endTime = Date.now();
          
          // More intelligent error handling
          let status: "Up" | "Down" | "Unknown" = "Down";
          let errorType = 'Unknown';
          
          if (error.response) {
            // If we got a response, the server is reachable
            const statusCode = error.response.status;
            if (statusCode >= 200 && statusCode < 500) {
              status = "Up"; // 2xx, 3xx, 4xx should be considered UP
              errorType = `HTTP ${statusCode}`;
            } else {
              status = "Down"; // 5xx server errors
              errorType = `Server Error ${statusCode}`;
            }
          } else if (error.code === 'ECONNREFUSED') {
            errorType = 'Connection Refused';
            status = "Down";
          } else if (error.code === 'ENOTFOUND') {
            errorType = 'DNS Resolution Failed';
            status = "Down";
          } else if (error.code === 'ECONNRESET') {
            errorType = 'Connection Reset';
            status = "Down";
          } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
            errorType = 'Timeout';
            status = "Down";
          } else {
            errorType = error.code || 'Network Error';
            status = "Down";
          }
          
          console.log(`Website ${message.url} is ${status} - Error: ${errorType} - ${error.message}`);
          
          await client.websiteTick.create({
            data: {
              response_time_ms: endTime - startTime,
              status: status,
              region_id: regionId,
              website_id: message.id,
            },
          });
        }
        processed++;
      } catch (error) {
        console.error(`Error processing website ${message.id}:`, error);
      }
    }

    // Acknowledge processed messages
    await xAckBulk(regionId, response.map(({ id }) => id));
    
    res.json({ 
      message: `Successfully processed ${processed} websites in region '${region.name}' with worker '${workerId}'`,
      processed: processed,
      total: response.length,
      regionName: region.name,
      workerId: workerId
    });
  } catch (error) {
    console.error("Worker trigger error:", error);
    res.status(500).json({ error: "Failed to trigger worker" });
  }
});

export default router;
