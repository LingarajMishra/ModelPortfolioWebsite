import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Photo } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PhotoView() {
  const { id } = useParams<{ id: string }>();

  const { data: photo, isLoading } = useQuery<Photo>({
    queryKey: [`/api/photos/${id}`],
    async queryFn() {
      // Try to fetch from static data first
      try {
        const response = await fetch('/data/photos.json');
        if (response.ok) {
          const allPhotos = await response.json();
          const foundPhoto = allPhotos.find((p: Photo) => p.id === parseInt(id));
          if (foundPhoto) {
            return foundPhoto;
          }
        }
      } catch (e) {
        console.log('Falling back to API');
      }
      // Fall back to API if static data is not available
      const response = await fetch(`/api/photos/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch photo');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Photo not found</h1>
        <Button asChild>
          <Link href="/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href="/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto rounded-t-lg"
          />
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{photo.title}</h1>
            {photo.description && (
              <p className="text-muted-foreground">{photo.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Category: {photo.category}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}