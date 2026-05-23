import type { Meta, StoryObj } from '@storybook/react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../utils/content';

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeProduct = (overrides: Partial<Product['data']> & { id?: string } = {}): Product => ({
  id: overrides.id ?? 'product-1',
  body: 'A sample product description.',
  data: {
    title: 'Custom Ergonomic Desk Riser',
    price: 45.0,
    image: '/images/product-1.jpg',
    purchase: {},
    featured: true,
    ...overrides,
  },
});

export const WithEbayLink: Story = {
  args: {
    product: makeProduct({
      title: 'Custom Ergonomic Desk Riser',
      price: 45.0,
      image: '/images/product-1.jpg',
      purchase: { physical: { ebay: 'https://www.ebay.com' } },
    }),
  },
};

export const WithMakerWorldLink: Story = {
  args: {
    product: makeProduct({
      id: 'product-10',
      title: 'Parametric Cable Holder',
      price: 0,
      image: '/images/product-10.jpg',
      purchase: { digital: { makerworld: 'https://makerworld.com' } },
    }),
  },
};

export const OnSaleWithRedBadge: Story = {
  args: {
    product: makeProduct({
      title: 'AMS Filament Coupler',
      price: 18.0,
      originalPrice: 24.0,
      badge: 'Sale',
      badgeColor: 'red',
      image: '/images/product-1.jpg',
      purchase: { physical: { ebay: 'https://www.ebay.com' } },
    }),
  },
};

export const NewWithGreenBadge: Story = {
  args: {
    product: makeProduct({
      id: 'product-10',
      title: 'Multi-Colour Prusa Nozzle Cap',
      price: 12.0,
      badge: 'New',
      badgeColor: 'green',
      image: '/images/product-10.jpg',
      purchase: { digital: { makerworld: 'https://makerworld.com' } },
    }),
  },
};

export const HybridPurchase: Story = {
  args: {
    product: makeProduct({
      title: 'Workshop Alignment Kit',
      price: 22.0,
      badge: 'Bundle',
      badgeColor: 'green',
      image: '/images/hero-bg.jpg',
      purchase: {
        physical: { ebay: 'https://www.ebay.com' },
        digital: { makerworld: 'https://makerworld.com' },
      },
    }),
  },
};
