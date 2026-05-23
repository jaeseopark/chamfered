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
    title: 'Ready-to-print 3D Models',
    ctaText: 'Download for free',
    ctaHref: 'https://makerworld.com/en/@jaeseopark/upload',
  },
};

export const AltTitle = {
  args: {
    backgroundImage: '/images/hero-bg.jpg',
    title: 'Functional Prints, Shipped to You',
    ctaText: 'Shop on eBay',
    ctaHref: 'https://www.ebay.com',
  },
};
