import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PhotoGrid from "@/components/gallery/photo-grid";
import type { Photo } from "@shared/schema";

export default function Home() {
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos/featured"],
  });

  return (
    <div className="space-y-16">
      <section className="py-24 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Professional Model Portfolio
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Showcasing versatility and professionalism through captivating imagery
        </motion.p>
        <Button asChild size="lg">
          <Link href="/gallery">
            View Gallery
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-8">Featured Work</h2>
        <PhotoGrid photos={photos} isLoading={isLoading} />
      </section>
    </div>
  );
}
