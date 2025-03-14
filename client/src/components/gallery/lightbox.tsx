import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@shared/schema";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  const { toast } = useToast();

  if (!photo) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/photo/${photo.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied!",
        description: "Photo link has been copied to your clipboard.",
      });
    });
  };

  return (
    <Dialog open={Boolean(photo)} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-screen-lg">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share photo</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="mt-4">
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