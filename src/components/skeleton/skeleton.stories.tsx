import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Skeleton } from './skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    width: 200,
    height: 20,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default skeleton component
 */
export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

/**
 * Skeleton with custom dimensions
 */
export const CustomDimensions: Story = {
  args: {
    width: 150,
    height: 40,
  },
};

/**
 * Skeleton with border radius
 */
export const WithBorderRadius: Story = {
  args: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
};

/**
 * Skeleton text line
 */
export const TextLine: Story = {
  args: {
    width: '100%',
    height: 16,
  },
};

/**
 * Skeleton card
 */
export const Card: Story = {
  args: {},
  render: () => (
    <View className="gap-sm p-md bg-surface rounded-lg">
      <Skeleton width="100%" height={20} />
      <Skeleton width="80%" height={16} />
      <Skeleton width="60%" height={16} />
    </View>
  ),
};

/**
 * Multiple skeletons
 */
export const Multiple: Story = {
  args: {},
  render: () => (
    <View className="gap-sm">
      <Skeleton width="100%" height={20} />
      <Skeleton width="90%" height={16} />
      <Skeleton width="75%" height={16} />
      <Skeleton width="50%" height={16} />
    </View>
  ),
};
