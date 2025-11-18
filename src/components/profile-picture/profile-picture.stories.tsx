import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { ProfilePicture } from './index';

const meta = {
  title: 'Components/ProfilePicture',
  component: ProfilePicture,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface items-center justify-center rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    enableHaptic: {
      control: { type: 'boolean' },
    },
  },
  args: {
    enableHaptic: true,
  },
} satisfies Meta<typeof ProfilePicture>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default profile picture (placeholder)
 */
export const Default: Story = {
  args: {
    onProfilePress: () => {},
  },
};

/**
 * Profile picture with image
 */
export const WithImage: Story = {
  args: {
    profilePictureUri:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    onProfilePress: () => {},
  },
};

/**
 * Profile picture without haptic
 */
export const WithoutHaptic: Story = {
  args: {
    enableHaptic: false,
    onProfilePress: () => {},
  },
};
