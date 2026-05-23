import type { Meta, StoryObj } from '@storybook/react';
import HeroSection from '../components/HeroSection';

const meta = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backgroundImage: '/images/hero-bg.jpg',
    title: 'Ready-to-print 3D models and shipped parts',
    description:
      'A broader storefront hero with layered messaging, product-format highlights, and dual CTAs.',
    ctaText: 'Browse the catalog',
    ctaHref: '/products',
    secondaryCtaText: 'Start a project',
    secondaryCtaHref: '/#contact',
  },
};

export const AltTitle: Story = {
  args: {
    backgroundImage: '/images/hero-bg.jpg',
    title: 'Functional Prints, Shipped to You',
    description: 'Use the same hero component for marketplace-led landing pages.',
    ctaText: 'Shop on eBay',
    ctaHref: 'https://www.ebay.com',
  },
};
