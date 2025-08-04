import express from "express";
import cors from "cors";

// Import route modules
import userRoutes from "./routes/userRoutes";
import websiteRoutes from "./routes/websiteRoutes";
import regionRoutes from "./routes/regionRoutes";
import monitoringRoutes from "./routes/monitoringRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route handlers
app.use("/user", userRoutes);
app.use("/websites", websiteRoutes);
app.use("/regions", regionRoutes);
app.use("/", monitoringRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "UpTime Monitor API is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 UpTime Monitor API Server is running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
});
