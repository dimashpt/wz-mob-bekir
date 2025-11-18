import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Text } from '../text';
import { Divider } from './index';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default divider component
 */
export const Default: Story = {
  args: {},
  render: () => (
    <View className="gap-md">
      <Text variant="bodyM">Content above</Text>
      <Divider />
      <Text variant="bodyM">Content below</Text>
    </View>
  ),
};

/**
 * Divider in list
 */
export const InList: Story = {
  args: {},
  render: () => (
    <View className="gap-xs">
      <View className="py-sm">
        <Text variant="bodyM">Item 1</Text>
      </View>
      <Divider />
      <View className="py-sm">
        <Text variant="bodyM">Item 2</Text>
      </View>
      <Divider />
      <View className="py-sm">
        <Text variant="bodyM">Item 3</Text>
      </View>
    </View>
  ),
};
