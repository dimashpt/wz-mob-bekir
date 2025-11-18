import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import DetailItem from './index';

const meta = {
  title: 'Components/DetailItem',
  component: DetailItem,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    label: 'Label',
    value: 'Value',
  },
} satisfies Meta<typeof DetailItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default detail item component
 */
export const Default: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
  },
};

/**
 * Detail item with icon
 */
export const WithIcon: Story = {
  args: {
    label: 'User',
    value: 'John Doe',
    icon: 'user',
  },
};

/**
 * Multiple detail items
 */
export const Multiple: Story = {
  args: {},
  render: () => (
    <View className="gap-md">
      <DetailItem label="User" value="John Doe" icon="user" />
      <DetailItem label="Home" value="Main Dashboard" icon="home" />
      <DetailItem label="Info" value="Additional information" icon="info" />
    </View>
  ),
};
