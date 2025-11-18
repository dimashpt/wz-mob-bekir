import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Icon } from '../icon';
import { FloatingActionButton } from './index';

const meta = {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButton,
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
    hidden: {
      control: { type: 'boolean' },
    },
  },
  args: {
    disabled: false,
    hidden: false,
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default floating action button
 */
export const Default: Story = {
  args: {},
  render: (args) => <FloatingActionButton {...args} onPress={() => {}} />,
};

/**
 * FAB with label
 */
export const WithLabel: Story = {
  args: {},
  render: () => (
    <FloatingActionButton
      onPress={() => {}}
      label="Add"
      icon={<Icon name="plus" size={24} className="text-white" />}
    />
  ),
};

/**
 * FAB with custom icon
 */
export const CustomIcon: Story = {
  args: {},
  render: () => (
    <FloatingActionButton
      onPress={() => {}}
      icon={<Icon name="gear" size={24} className="text-white" />}
    />
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {},
  render: () => <FloatingActionButton onPress={() => {}} disabled />,
};
