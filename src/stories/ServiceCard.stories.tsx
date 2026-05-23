import type { Meta, StoryObj } from '@storybook/react';
import ServiceCard from '../components/ServiceCard';

const meta = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DigitalFiles: Story = {
  args: {
    icon: 'document-outline',
    title: 'Digital Files',
    children: (
      <>
        Ready-to-print STL files for your own machine.{' '}
        <a href="https://makerworld.com" target="_blank" rel="noopener">
          Browse the MakerWorld shop
        </a>
        .
      </>
    ),
  },
};

export const CustomDesign: Story = {
  args: {
    icon: 'pencil-outline',
    title: 'Custom Design',
    children: (
      <>
        Bespoke CAD modeling to create specific parts you can't find elsewhere.{' '}
        <a href="#">Email me</a> to start your project.
      </>
    ),
  },
};

export const PhysicalGoods: Story = {
  args: {
    icon: 'cube-outline',
    title: 'Physical Goods',
    children: (
      <>
        Durable, 3D-printed items shipped directly to you.{' '}
        <a href="#" target="_blank" rel="noreferrer noopener">
          See the Etsy catalog
        </a>
        .
      </>
    ),
  },
};
