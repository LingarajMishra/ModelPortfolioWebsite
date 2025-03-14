import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";
import { insertPhotoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Azure Storage connection string not found");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );
  const containerName = "portfolio-photos";

  app.get("/api/photos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const photos = category 
        ? await storage.getPhotosByCategory(category)
        : await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/featured", async (req, res) => {
    try {
      const photos = await storage.getFeaturedPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured photos" });
    }
  });

  app.post("/api/photos/upload", async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Generate unique blob name
      const blobName = `${Date.now()}-${photoData.title.toLowerCase().replace(/\s+/g, '-')}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Get upload URL
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions: BlobSASPermissions.parse("w"),
        expiresOn: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      });

      res.json({ uploadUrl: sasUrl, blobName });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}