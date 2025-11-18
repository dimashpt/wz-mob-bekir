import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Button } from '../button';
import { Header } from './index';

const meta = {
  title: 'Components/Header',
  component: Header,
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
      options: ['default', 'transparent'],
    },
    hideBack: {
      control: { type: 'boolean' },
    },
  },
  args: {
    type: 'default',
    hideBack: false,
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default header with title
 */
export const Default: Story = {
  args: {
    title: 'Header Title',
  },
};

/**
 * Header without back button
 */
export const WithoutBack: Story = {
  args: {
    title: 'Header Title',
    hideBack: true,
  },
};

/**
 * Header with right content
 */
export const WithRightContent: Story = {
  args: {
    title: 'Header Title',
    rightContent: (
      <Button
        text="Action"
        size="small"
        variant="ghost"
        color="primary"
        onPress={() => {}}
      />
    ),
  },
};

/**
 * Transparent header
 */
export const Transparent: Story = {
  args: {
    title: 'Transparent Header',
    type: 'transparent',
  },
  decorators: [
    (Story) => (
      <View className="from-accent to-background flex-1 bg-gradient-to-b">
        <Story />
      </View>
    ),
  ],
};

/**
 * Header with children
 */
export const WithChildren: Story = {
  args: {
    title: 'Header with Children',
    children: (
      <View className="p-md bg-surface">
        <View className="bg-muted h-20 rounded-md" />
      </View>
    ),
  },
};
