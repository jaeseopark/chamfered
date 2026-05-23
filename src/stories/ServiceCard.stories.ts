import ServiceCard from '../components/ServiceCard.astro';

export default {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
};

export const DigitalFiles = {
  args: {
    icon: 'document-outline',
    title: 'Digital Files',
    slots: {
      default:
        'Ready-to-print STL files for your own machine.',
    },
  },
};

export const CustomDesign = {
  args: {
    icon: 'pencil-outline',
    title: 'Custom Design',
    slots: {
      default:
        'Bespoke CAD modeling to create specific parts you can\'t find elsewhere. <a href="#">Email me</a> to start your project.',
    },
  },
};

export const PhysicalGoods = {
  args: {
    icon: 'cube-outline',
    title: 'Physical Goods',
    slots: {
      default:
        'Durable, 3D-printed items shipped directly to you.',
    },
  },
};
