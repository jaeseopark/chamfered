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
    ebayLink: 'https://www.ebay.com/itm/123456',
  },
};

export const WithMakerWorldLink = {
  args: {
    title: 'Parametric Cable Holder',
    price: 0,
    image: '/images/product-10.jpg',
    makerWorldLink: 'https://makerworld.com/en/models/123456',
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
    ebayLink: 'https://www.ebay.com/itm/123456',
  },
};

export const NewWithGreenBadge = {
  args: {
    title: 'Multi-Colour Prusa Nozzle Cap',
    price: 12.0,
    badge: 'New',
    badgeColor: 'green' as const,
    image: '/images/product-10.jpg',
    makerWorldLink: 'https://makerworld.com/en/models/654321',
  },
};

export const NoLink = {
  args: {
    title: 'Coming Soon Item',
    price: 0,
    image: '/images/product-1.jpg',
  },
};
