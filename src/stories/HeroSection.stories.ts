import HeroSection from '../components/HeroSection.astro';

export default {
  title: 'Sections/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    backgroundImage: '/images/hero-bg.jpg',
    title: 'Ready-to-print 3D models and shipped parts',
    description: 'A broader storefront hero with layered messaging, product-format highlights, and dual CTAs.',
    ctaText: 'Browse the catalog',
    ctaHref: '/products/',
    secondaryCtaText: 'Start a project',
    secondaryCtaHref: '/#contact',
  },
};

export const AltTitle = {
  args: {
    backgroundImage: '/images/hero-bg.jpg',
    title: 'Functional Prints, Shipped to You',
    description: 'Use the same hero component for marketplace-led landing pages.',
    ctaText: 'Shop on eBay',
    ctaHref: 'https://www.ebay.com',
  },
};
