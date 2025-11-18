import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Chip } from './index';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['blue', 'gray', 'yellow', 'red', 'green', 'clear'],
    },
  },
  args: {
    variant: 'blue',
    label: 'Chip',
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default chip component
 */
export const Default: Story = {
  args: {
    label: 'Chip',
    variant: 'blue',
  },
};

/**
 * Chip variants
 */
export const Blue: Story = {
  args: {
    label: 'Blue Chip',
    variant: 'blue',
  },
};

export const Gray: Story = {
  args: {
    label: 'Gray Chip',
    variant: 'gray',
  },
};

export const Yellow: Story = {
  args: {
    label: 'Yellow Chip',
    variant: 'yellow',
  },
};

export const Red: Story = {
  args: {
    label: 'Red Chip',
    variant: 'red',
  },
};

export const Green: Story = {
  args: {
    label: 'Green Chip',
    variant: 'green',
  },
};

export const Clear: Story = {
  args: {
    label: 'Clear Chip',
    variant: 'clear',
  },
};

/**
 * Chip with prefix icon
 */
export const WithPrefix: Story = {
  args: {
    label: 'With Icon',
    variant: 'blue',
    prefix: <View className="h-3 w-3 rounded-full bg-white" />,
  },
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  args: {},
  render: () => (
    <View className="gap-sm flex-row flex-wrap">
      <Chip label="Blue" variant="blue" />
      <Chip label="Gray" variant="gray" />
      <Chip label="Yellow" variant="yellow" />
      <Chip label="Red" variant="red" />
      <Chip label="Green" variant="green" />
      <Chip label="Clear" variant="clear" />
    </View>
  ),
};
