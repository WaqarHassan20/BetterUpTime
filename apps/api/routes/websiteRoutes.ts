import { Router } from "express";
import { client } from "store/client";
import { authMiddleware } from "../middleware";

const router = Router();

// Create a new website
router.post("/", authMiddleware, async (req, res) => {
  const url = req.body.url;

  try {
    if (!url || !url.trim()) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Normalize and validate URL
    let normalizedUrl = url.trim();
    
    // Remove protocol if present for consistent storage
    normalizedUrl = normalizedUrl.replace(/^https?:\/\//, '');
    
    // Validate URL format by trying to construct with https
    try {
      new URL(`https://${normalizedUrl}`);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format. Please enter a valid domain (e.g., example.com)" });
    }
    
    // Check for duplicate URLs for this user
    const existingWebsite = await client.website.findFirst({
      where: {
        userId: req.userId,
        url: normalizedUrl,
      }
    });
    
    if (existingWebsite) {
      return res.status(409).json({ error: "This website is already being monitored" });
    }

    const website = await client.website.create({
      data: {
        url: normalizedUrl,
        timeAdded: new Date(),
        userId: req.userId,
      },
    });

    res.json({
      Website: normalizedUrl,
      Id: website.id,
      message: "Website added successfully and ready for monitoring!"
    });
  } catch (error) {
    console.error("Error creating website:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get website status by ID
router.get("/status/:websiteId", authMiddleware, async (req, res) => {
  const { websiteId } = req.params;

  const website = await client.website.findFirst({
    where: {
      userId: req.userId,
      id: websiteId,
    },
    include: {
      ticks: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
  });

  if (!website) {
    res.status(409).json({
      message: "Website not found",
    });
    return;
  }

  res.json({
    website,
  });
});

// Get all websites for user
router.get("/", authMiddleware, async (req, res) => {
  const websites = await client.website.findMany({
    where: { userId: req.userId },
    include: {
      ticks: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
  });

  res.json({
    websites,
  });
});

// Delete a website
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const websiteId = req.params.id;
    const userId = req.userId;

    const website = await client.website.findUnique({
      where: { id: websiteId }
    });

    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }

    if (website.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this website" });
    }

    // First delete all related WebsiteTick records
    await client.websiteTick.deleteMany({
      where: { website_id: websiteId }
    });

    // Then delete the website
    await client.website.delete({
      where: { id: websiteId }
    });

    res.status(204).end();

  } catch (error) {
    console.error("Delete website error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
