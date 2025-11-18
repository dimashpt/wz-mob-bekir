import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Text } from '../text';
import { Clickable } from './index';

const meta = {
  title: 'Components/Clickable',
  component: Clickable,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    enableHaptic: {
      control: { type: 'boolean' },
    },
  },
  args: {
    disabled: false,
    enableHaptic: false,
  },
} satisfies Meta<typeof Clickable>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default clickable component
 */
export const Default: Story = {
  args: {
    children: <View />,
  },
  render: (args) => (
    <Clickable {...args} onPress={() => {}}>
      <View className="bg-accent p-md rounded-md">
        <Text variant="bodyM" color="light">
          Clickable
        </Text>
      </View>
    </Clickable>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Clickable disabled onPress={() => {}}>
      <View className="bg-muted p-md rounded-md">
        <Text variant="bodyM">Disabled Clickable</Text>
      </View>
    </Clickable>
  ),
};

/**
 * With haptic feedback
 */
export const WithHaptic: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Clickable enableHaptic onPress={() => {}}>
      <View className="bg-accent p-md rounded-md">
        <Text variant="bodyM" color="light">
          With Haptic Feedback
        </Text>
      </View>
    </Clickable>
  ),
};

/**
 * Custom content
 */
export const CustomContent: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Clickable onPress={() => {}}>
      <View className="bg-surface p-lg border-border gap-sm rounded-lg border">
        <Text variant="labelL">Custom Content</Text>
        <Text variant="bodyS" color="muted">
          This clickable contains custom content
        </Text>
      </View>
    </Clickable>
  ),
};
