import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories, type Photo } from "@shared/schema";
import PhotoGrid from "@/components/gallery/photo-grid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Gallery() {
  const [category, setCategory] = useState<string>("all");

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos", category !== "all" ? category : undefined],
    async queryFn() {
      // Try to fetch from static data first
      try {
        const response = await fetch('/data/photos.json');
        if (response.ok) {
          const allPhotos = await response.json();
          // Filter by category if needed
          return category !== "all" 
            ? allPhotos.filter(photo => photo.category === category)
            : allPhotos;
        }
      } catch (e) {
        console.log('Falling back to API');
      }
      // Fall back to API if static data is not available
      const response = await fetch(`/api/photos${category !== "all" ? `?category=${category}` : ''}`);
      return response.json();
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Photo Gallery</h1>
        <Tabs
          value={category}
          onValueChange={setCategory}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <PhotoGrid photos={photos} isLoading={isLoading} />
    </div>
  );
}