import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const hasAtLeastOneLink = (links: Record<string, string | undefined>) =>
  Object.values(links).some((link) => typeof link === 'string' && link.length > 0);

const physicalPurchaseSchema = z.object({
  ebay: z.url().optional(),
  amazon: z.url().optional(),
  etsy: z.url().optional(),
}).refine(hasAtLeastOneLink, {
  message: 'Provide at least one physical purchase link.',
});

const digitalPurchaseSchema = z.object({
  makerworld: z.url().optional(),
  printables: z.url().optional(),
  thingiverse: z.url().optional(),
}).refine(hasAtLeastOneLink, {
  message: 'Provide at least one digital download link.',
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    price: z.number(),
    originalPrice: z.number().optional(),
    badge: z.string().optional(),
    badgeColor: z.enum(['red', 'green']).optional(),
    image: z.string(),
    purchase: z.object({
      physical: physicalPurchaseSchema.optional(),
      digital: digitalPurchaseSchema.optional(),
    }).refine(({ physical, digital }) => physical !== undefined || digital !== undefined, {
      message: 'Provide at least one purchase option.',
    }),
    featured: z.boolean().default(true),
    order: z.number().optional(),
  }),
});

export const collections = { products };
