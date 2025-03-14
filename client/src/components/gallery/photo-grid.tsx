import { useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Lightbox from "./lightbox";
import type { Photo } from "@shared/schema";

interface PhotoGridProps {
  photos?: Photo[];
  isLoading: boolean;
}

export default function PhotoGrid({ photos, isLoading }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos?.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-[3/4] group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-4">
              <div className="text-white">
                <h3 className="font-semibold">{photo.title}</h3>
                <p className="text-sm text-white/80">{photo.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
