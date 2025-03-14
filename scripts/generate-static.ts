import { storage } from "../server/storage";
import fs from "fs/promises";
import path from "path";

async function generateStaticData() {
  // Get all photos and featured photos
  const allPhotos = await storage.getPhotos();
  const featuredPhotos = await storage.getFeaturedPhotos();

  // Create the public directory if it doesn't exist
  await fs.mkdir("public/data", { recursive: true });

  // Write the data files
  await fs.writeFile(
    "public/data/photos.json",
    JSON.stringify(allPhotos, null, 2)
  );

  await fs.writeFile(
    "public/data/featured.json",
    JSON.stringify(featuredPhotos, null, 2)
  );

  console.log("Static data generated successfully!");
}

generateStaticData().catch(console.error);
