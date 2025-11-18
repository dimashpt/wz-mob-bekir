import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { MenuItem } from './index';

const meta = {
  title: 'Components/MenuItem',
  component: MenuItem,
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
} satisfies Meta<typeof MenuItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default menu item component
 */
export const Default: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
  },
};

/**
 * Menu item with icon
 */
export const WithIcon: Story = {
  args: {
    label: 'User',
    value: 'John Doe',
    icon: 'user',
  },
};

/**
 * Menu item without value
 */
export const WithoutValue: Story = {
  args: {
    label: 'Settings',
    value: null,
    icon: 'gear',
  },
};

/**
 * Menu item with onPress
 */
export const Clickable: Story = {
  args: {
    label: 'Home',
    value: 'Go to home',
    icon: 'home',
    onPress: () => {},
  },
};

/**
 * Menu item action variant
 */
export const Action: Story = {
  args: {},
  render: () => (
    <MenuItem.Action
      label="Delete Account"
      value="Dangerous action"
      icon="trash"
      onPress={() => {}}
    />
  ),
};

/**
 * Multiple menu items
 */
export const Multiple: Story = {
  args: {},
  render: () => (
    <View className="gap-xs">
      <MenuItem label="User" value="John Doe" icon="user" />
      <MenuItem label="Home" value="Main Dashboard" icon="home" />
      <MenuItem label="Info" value="Additional info" icon="info" />
      <MenuItem.Action label="Logout" icon="logout" onPress={() => {}} />
    </View>
  ),
};
