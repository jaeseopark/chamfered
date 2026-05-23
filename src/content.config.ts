import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    price: z.number(),
    originalPrice: z.number().optional(),
    badge: z.string().optional(),
    badgeColor: z.enum(['red', 'green']).optional(),
    images: z.array(z.string()).min(1),
    ebayLink: z.url().optional(),
    makerWorldLink: z.url().optional(),
    featured: z.boolean().default(true),
    order: z.number().optional(),
  }),
});

export const collections = { products };
