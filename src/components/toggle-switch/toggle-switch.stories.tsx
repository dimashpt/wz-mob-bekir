import type { Meta, StoryObj } from '@storybook/react-native';

import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '../text';
import { ToggleSwitch } from './index';

const meta = {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
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
      control: { type: 'radio' },
      options: ['default', 'small'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    size: 'default',
    disabled: false,
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default toggle switch (off)
 */
export const Default: Story = {
  args: {
    value: false,
    onValueChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(false);
    return <ToggleSwitch {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * Toggle switch (on)
 */
export const On: Story = {
  args: {
    value: true,
    onValueChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(true);
    return <ToggleSwitch {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    value: false,
    onValueChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(false);
    return (
      <ToggleSwitch
        {...args}
        size="small"
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    value: false,
    onValueChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState(false);
    return (
      <View className="gap-md">
        <View className="gap-xs flex-row items-center">
          <ToggleSwitch value={value} onValueChange={setValue} disabled />
          <Text variant="bodyM">Disabled (off)</Text>
        </View>
        <View className="gap-xs flex-row items-center">
          <ToggleSwitch value={true} onValueChange={setValue} disabled />
          <Text variant="bodyM">Disabled (on)</Text>
        </View>
      </View>
    );
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  args: {
    value: false,
    onValueChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState(false);
    return (
      <View className="gap-md">
        <View className="gap-xs flex-row items-center justify-between">
          <Text variant="bodyM">Enable notifications</Text>
          <ToggleSwitch value={value} onValueChange={setValue} />
        </View>
        <View className="gap-xs flex-row items-center justify-between">
          <Text variant="bodyM">Dark mode</Text>
          <ToggleSwitch value={true} onValueChange={setValue} />
        </View>
      </View>
    );
  },
};
