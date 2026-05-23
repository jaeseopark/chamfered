import type { Meta, StoryObj } from '@storybook/react';
import AboutSection from '../components/AboutSection';

const meta = {
  title: 'Sections/AboutSection',
  component: AboutSection,
  tags: ['autodocs'],
} satisfies Meta<typeof AboutSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
