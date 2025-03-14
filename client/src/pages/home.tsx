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
    async queryFn() {
      // Try to fetch from static data first
      try {
        const response = await fetch('/data/featured.json');
        if (response.ok) {
          return response.json();
        }
      } catch (e) {
        console.log('Falling back to API');
      }
      // Fall back to API if static data is not available
      const response = await fetch('/api/photos/featured');
      return response.json();
    }
  });

  return (
    <div className="space-y-24">
      <section className="relative -mt-16 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.05),transparent_50%)]" />
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Elevate Your Vision
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Showcasing premium photography that captures the essence of style,
            elegance, and professional excellence
          </motion.p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/gallery">
              Explore Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-semibold">Featured Work</h2>
          <Button variant="ghost" asChild>
            <Link href="/gallery" className="text-muted-foreground hover:text-foreground">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <PhotoGrid photos={photos} isLoading={isLoading} />
      </section>
    </div>
  );
}