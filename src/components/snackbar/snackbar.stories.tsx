import type { Meta, StoryObj } from '@storybook/react-native';

import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '../button';
import { Snackbar } from './snackbar';

const meta = {
  title: 'Components/Snackbar',
  component: Snackbar,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['error', 'success', 'info'],
    },
    visible: {
      control: { type: 'boolean' },
    },
  },
  args: {
    type: 'info',
    visible: true,
    message: 'This is a snackbar message',
  },
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default snackbar (info)
 */
export const Default: Story = {
  args: {
    visible: true,
    message: 'This is an info snackbar',
    type: 'info',
  },
};

/**
 * Success snackbar
 */
export const Success: Story = {
  args: {
    visible: true,
    message: 'Operation completed successfully',
    type: 'success',
  },
};

/**
 * Error snackbar
 */
export const Error: Story = {
  args: {
    visible: true,
    message: 'An error occurred',
    type: 'error',
  },
};

/**
 * Snackbar with long message
 */
export const LongMessage: Story = {
  args: {
    visible: true,
    message:
      'This is a very long message that should wrap properly and display correctly in the snackbar component',
    type: 'info',
  },
};

/**
 * Interactive snackbar
 */
export const Interactive: Story = {
  args: {},
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <View className="gap-md flex-1 items-center justify-center">
        <Button text="Show Snackbar" onPress={() => setVisible(true)} />
        <Snackbar
          visible={visible}
          message="This snackbar can be dismissed"
          type="info"
          onDismiss={() => setVisible(false)}
        />
      </View>
    );
  },
};
