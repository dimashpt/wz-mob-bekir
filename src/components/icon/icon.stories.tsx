import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Icon } from './index';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
    },
  },
  args: {
    name: 'user',
    size: 'base',
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default icon component
 */
export const Default: Story = {
  args: {
    name: 'user',
  },
};

/**
 * Icon sizes
 */
export const XSmall: Story = {
  args: {
    name: 'user',
    size: 'xxs',
  },
};

export const Small: Story = {
  args: {
    name: 'user',
    size: 'sm',
  },
};

export const Base: Story = {
  args: {
    name: 'user',
    size: 'base',
  },
};

export const Large: Story = {
  args: {
    name: 'user',
    size: 'lg',
  },
};

export const XLarge: Story = {
  args: {
    name: 'user',
    size: 'xl',
  },
};

/**
 * Common icons showcase
 */
export const CommonIcons: Story = {
  args: {},
  render: () => (
    <View className="gap-md flex-row flex-wrap">
      <View className="gap-xs items-center">
        <Icon name="user" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="arrow" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="chevron" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="plus" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="close" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="tick" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="info" size="lg" />
      </View>
      <View className="gap-xs items-center">
        <Icon name="home" size="lg" />
      </View>
    </View>
  ),
};
