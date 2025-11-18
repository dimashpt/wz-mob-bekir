import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Text } from '../text';
import { Container } from './index';

const meta = {
  title: 'Components/Container',
  component: Container,
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
      options: ['default', 'transparent', 'surface'],
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default container component
 */
export const Default: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Container variant="default">
      <View className="p-md">
        <Text variant="bodyM">Default Container</Text>
      </View>
    </Container>
  ),
};

/**
 * Container variants
 */
export const Transparent: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Container variant="transparent">
      <View className="p-md">
        <Text variant="bodyM">Transparent Container</Text>
      </View>
    </Container>
  ),
};

export const Surface: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Container variant="surface">
      <View className="p-md">
        <Text variant="bodyM">Surface Container</Text>
      </View>
    </Container>
  ),
};

/**
 * Scroll container
 */
export const Scroll: Story = {
  args: {
    children: <View />,
  },
  render: () => (
    <Container.Scroll>
      <View className="p-md gap-sm">
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} className="bg-surface p-md rounded-md">
            <Text variant="bodyM">Item {i + 1}</Text>
          </View>
        ))}
      </View>
    </Container.Scroll>
  ),
};
