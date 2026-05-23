import type { StorybookConfig } from '@storybook-astro/framework';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: {
    name: '@storybook-astro/framework',
    options: {},
  },
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};

export default config;
