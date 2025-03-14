import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  blobName: text("blob_name").notNull(),
  featured: boolean("featured").default(false),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({ 
  id: true 
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export const categories = [
  "portrait",
  "editorial",
  "commercial",
  "runway"
] as const;
