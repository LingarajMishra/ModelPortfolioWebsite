import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ContainerClient, BlobSASPermissions } from "@azure/storage-blob";
import { insertPhotoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const azureUrl = process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
  if (!azureUrl) {
    throw new Error("Azure Storage SAS URL not found");
  }

  console.log("Creating Container Client...");
  let containerClient: ContainerClient;
  try {
    containerClient = new ContainerClient(azureUrl);
    console.log("Container Client created successfully");
  } catch (error) {
    console.error("Failed to create Container Client:", error);
    throw error;
  }

  app.get("/api/photos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const photos = category 
        ? await storage.getPhotosByCategory(category)
        : await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/featured", async (req, res) => {
    try {
      const photos = await storage.getFeaturedPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching featured photos:", error);
      res.status(500).json({ message: "Failed to fetch featured photos" });
    }
  });

  app.post("/api/photos/upload", async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const blobName = `${Date.now()}-${photoData.title.toLowerCase().replace(/\s+/g, '-')}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // For uploads, we'll generate a temporary SAS URL with write permissions
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions: BlobSASPermissions.parse("w"),
        expiresOn: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      });

      res.json({ uploadUrl: sasUrl, blobName });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}