import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { Photo } from "@shared/schema";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  if (!photo) return null;

  return (
    <Dialog open={Boolean(photo)} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-screen-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="mt-6">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <div className="mt-4">
            <h2 className="text-lg font-semibold">{photo.title}</h2>
            {photo.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {photo.description}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
