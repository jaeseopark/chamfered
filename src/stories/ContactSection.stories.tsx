import type { Meta, StoryObj } from '@storybook/react';
import ContactSection from '../components/ContactSection';

const meta = {
  title: 'Sections/ContactSection',
  component: ContactSection,
  tags: ['autodocs'],
} satisfies Meta<typeof ContactSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
