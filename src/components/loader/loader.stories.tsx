import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Icon } from '../icon';
import { Loader } from './index';

const meta = {
  title: 'Components/Loader',
  component: Loader,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface items-center justify-center rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    spin: {
      control: { type: 'radio' },
      options: [false, true, 'reverse'],
    },
  },
  args: {
    spin: false,
  },
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default loader component
 */
export const Default: Story = {
  args: {},
};

/**
 * Spinning loader
 */
export const Spinning: Story = {
  args: {
    spin: true,
  },
};

/**
 * Reverse spinning loader
 */
export const ReverseSpinning: Story = {
  args: {
    spin: 'reverse',
  },
};

/**
 * Loader with custom icon
 */
export const WithCustomIcon: Story = {
  args: {
    spin: true,
    icon: <Icon name="refresh" size={24} className="text-accent" />,
  },
};
