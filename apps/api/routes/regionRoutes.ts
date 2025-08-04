import { Router } from "express";
import { client } from "store/client";
import { authMiddleware } from "../middleware";

const router = Router();

// Create a new region
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Region name is required" });
    }

    // Check if region already exists
    const existingRegion = await client.region.findFirst({
      where: { name: name.trim() }
    });

    if (existingRegion) {
      return res.status(409).json({ error: "Region with this name already exists" });
    }

    const region = await client.region.create({
      data: {
        name: name.trim(),
      },
    });

    // Automatically create Redis XREADGROUP for the new region
    try {
      const { xCreateGroup } = await import("redisstream/client");
      await xCreateGroup(region.id);
      console.log(`Redis group created for region: ${region.id}`);
    } catch (redisError) {
      console.warn(`Redis group creation failed for region ${region.id}:`, redisError);
      // Don't fail the region creation if Redis group creation fails
    }

    res.json({
      message: "Region created successfully with Redis group",
      region: {
        id: region.id,
        name: region.name
      }
    });
  } catch (error) {
    console.error("Error creating region:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all regions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const regions = await client.region.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      regions,
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a region
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const regionId = req.params.id;

    const region = await client.region.findUnique({
      where: { id: regionId }
    });

    if (!region) {
      return res.status(404).json({ error: "Region not found" });
    }

    // Check if region has any website ticks
    const ticksCount = await client.websiteTick.count({
      where: { region_id: regionId }
    });

    if (ticksCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete region with existing monitoring data" 
      });
    }

    await client.region.delete({
      where: { id: regionId }
    });

    res.status(204).end();
  } catch (error) {
    console.error("Delete region error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
