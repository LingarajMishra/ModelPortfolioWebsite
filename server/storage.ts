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
  private containerName = "portfolio-photos";
  private containerInitialized = false;

  constructor() {
    this.photos = new Map();
    this.currentId = 1;

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error("Azure Storage connection string not found");
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING.trim();
    if (!connectionString.startsWith("DefaultEndpointsProtocol=")) {
      throw new Error("Invalid Azure Storage connection string format");
    }

    try {
      console.log("Initializing Azure Blob Service Client...");
      console.log(`Connection string length: ${connectionString.length}`);
      console.log(`Connection string starts with: ${connectionString.substring(0, 25)}...`);

      this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      console.log("Azure Blob Service Client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Azure Blob Service Client:", error);
      throw new Error("Failed to initialize storage service. Please check your connection string.");
    }
  }

  private async ensureContainerInitialized() {
    if (this.containerInitialized) return;

    try {
      console.log(`Initializing container: ${this.containerName}`);
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.createIfNotExists({
        access: 'blob' // Allow public read access to blobs
      });
      console.log(`Container ${this.containerName} initialized successfully`);
      this.containerInitialized = true;
    } catch (error) {
      console.error("Failed to initialize container:", error);
      throw new Error(`Failed to initialize storage container: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPhotos(): Promise<Photo[]> {
    await this.ensureContainerInitialized();
    return Array.from(this.photos.values());
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    await this.ensureContainerInitialized();
    return Array.from(this.photos.values()).filter(
      (photo) => photo.category === category
    );
  }

  async getFeaturedPhotos(): Promise<Photo[]> {
    await this.ensureContainerInitialized();
    return Array.from(this.photos.values()).filter(
      (photo) => photo.featured === true
    );
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    await this.ensureContainerInitialized();
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    await this.ensureContainerInitialized();
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
    await this.ensureContainerInitialized();
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