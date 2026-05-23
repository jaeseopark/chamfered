import matter from 'gray-matter';

export interface ProductData {
  title: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeColor?: 'red' | 'green';
  image: string;
  purchase: {
    physical?: {
      ebay?: string;
      amazon?: string;
      etsy?: string;
    };
    digital?: {
      makerworld?: string;
      printables?: string;
      thingiverse?: string;
    };
  };
  featured: boolean;
  order?: number;
  launchDate?: string;
}

export interface Product {
  id: string;
  data: ProductData;
  body: string;
}

const rawFiles = import.meta.glob<string>('../content/products/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export function getProducts(): Product[] {
  return Object.entries(rawFiles).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const id = path.split('/').pop()!.replace('.md', '');
    return {
      id,
      data: { featured: false, ...data } as ProductData,
      body: content.trim(),
    };
  });
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.id === slug);
}
