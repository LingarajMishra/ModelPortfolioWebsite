import type { InsertPhoto } from "@shared/schema";

export async function uploadPhoto(file: File, photo: InsertPhoto) {
  // First, get the upload URL from our backend
  const res = await fetch("/api/photos/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photo),
  });

  if (!res.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl, blobName } = await res.json();

  // Upload the file directly to Azure Blob Storage
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload photo");
  }

  return blobName;
}
