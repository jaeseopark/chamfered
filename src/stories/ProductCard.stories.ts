import ProductCard from '../components/ProductCard.astro';

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
};

export const WithEbayLink = {
  args: {
    title: 'Custom Ergonomic Desk Riser',
    price: 45.0,
    image: '/images/product-1.jpg',
    hasPhysicalPurchase: true,
  },
};

export const WithMakerWorldLink = {
  args: {
    title: 'Parametric Cable Holder',
    price: 0,
    image: '/images/product-10.jpg',
    hasDigitalPurchase: true,
  },
};

export const OnSaleWithRedBadge = {
  args: {
    title: 'AMS Filament Coupler',
    price: 18.0,
    originalPrice: 24.0,
    badge: 'Sale',
    badgeColor: 'red' as const,
    image: '/images/product-1.jpg',
    hasPhysicalPurchase: true,
  },
};

export const NewWithGreenBadge = {
  args: {
    title: 'Multi-Colour Prusa Nozzle Cap',
    price: 12.0,
    badge: 'New',
    badgeColor: 'green' as const,
    image: '/images/product-10.jpg',
    hasDigitalPurchase: true,
  },
};

export const HybridPurchase = {
  args: {
    title: 'Workshop Alignment Kit',
    price: 22.0,
    badge: 'Bundle',
    badgeColor: 'green' as const,
    image: '/images/hero-bg.jpg',
    hasPhysicalPurchase: true,
    hasDigitalPurchase: true,
  },
};

export const NoLink = {
  args: {
    title: 'Coming Soon Item',
    price: 0,
    image: '/images/product-1.jpg',
  },
};
