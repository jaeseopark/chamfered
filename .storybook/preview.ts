import type { Preview } from '@storybook-astro/framework';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'cultured', value: 'hsl(0, 0%, 96%)' },
        { name: 'dark', value: 'hsl(0, 0%, 9%)' },
      ],
    },
    layout: 'padded',
  },
};

export default preview;
