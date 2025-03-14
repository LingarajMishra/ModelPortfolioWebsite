import { photos, type Photo, type InsertPhoto } from "@shared/schema";
import { ContainerClient } from "@azure/storage-blob";

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
  private containerClient: ContainerClient;

  constructor() {
    this.photos = new Map();
    this.currentId = 1;

    const azureUrl = process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
    if (!azureUrl) {
      throw new Error("Azure Storage SAS URL not found");
    }

    try {
      console.log("Initializing Azure Container Client...");
      this.containerClient = new ContainerClient(azureUrl);
      console.log("Azure Container Client initialized successfully");

      // Initialize existing photos from blob storage
      this.initializeFromBlobStorage().catch(error => {
        console.error("Failed to initialize from blob storage:", error);
      });
    } catch (error) {
      console.error("Failed to initialize Azure Container Client:", error);
      throw error;
    }
  }

  private async initializeFromBlobStorage() {
    try {
      console.log("Loading existing photos from blob storage...");
      const blobs = this.containerClient.listBlobsFlat();

      for await (const blob of blobs) {
        const blobClient = this.containerClient.getBlobClient(blob.name);
        const url = blobClient.url;

        const [timestamp, title] = blob.name.split('-');
        const photo: Photo = {
          id: this.currentId++,
          url,
          title: title?.replace(/-/g, ' ') || 'Untitled',
          category: 'portrait', // Default category
          description: null,
          blobName: blob.name,
          featured: false
        };
        this.photos.set(photo.id, photo);
      }

      console.log(`Loaded ${this.photos.size} photos from blob storage`);
    } catch (error) {
      console.error("Error loading photos from blob storage:", error);
      throw error;
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
    const blobClient = this.containerClient.getBlobClient(photo.blobName);
    await blobClient.delete();

    this.photos.delete(id);
  }
}

export const storage = new MemStorage();