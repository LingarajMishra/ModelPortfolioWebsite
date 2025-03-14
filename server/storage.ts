import { photos, type Photo, type InsertPhoto } from "@shared/schema";
import { BlobServiceClient } from "@azure/storage-blob";

export interface IStorage {
  getPhotos(): Promise<Photo[]>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
  getFeaturedPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private photos: Map<number, Photo>;
  private currentId: number;
  private blobServiceClient: BlobServiceClient;
  private containerName = "myphoto";

  constructor() {
    this.photos = new Map();
    this.currentId = 1;

    const azureKey = process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
    if (!azureKey) {
      throw new Error("Azure Storage connection string not found");
    }

    try {
      console.log("Initializing Azure Blob Service Client...");
      // Check if the key is a SAS URL or connection string
      if (azureKey.startsWith("https://")) {
        console.log("Using SAS URL for Azure Blob Storage");
        this.blobServiceClient = new BlobServiceClient(azureKey);
      } else {
        console.log("Using connection string for Azure Blob Storage");
        this.blobServiceClient = BlobServiceClient.fromConnectionString(azureKey);
      }
      console.log("Azure Blob Service Client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Azure Blob Service Client:", error);
      throw new Error("Failed to initialize storage service");
    }
  }

  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.category === category
    );
  }

  async getFeaturedPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.featured === true
    );
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentId++;
    const photo: Photo = {
      id,
      url: insertPhoto.url,
      title: insertPhoto.title,
      category: insertPhoto.category,
      description: insertPhoto.description ?? null,
      blobName: insertPhoto.blobName,
      featured: insertPhoto.featured ?? false
    };
    this.photos.set(id, photo);
    return photo;
  }

  async deletePhoto(id: number): Promise<void> {
    const photo = await this.getPhoto(id);
    if (!photo) throw new Error("Photo not found");

    // Delete from blob storage
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(photo.blobName);
    await blockBlobClient.delete();

    this.photos.delete(id);
  }
}

export const storage = new MemStorage();