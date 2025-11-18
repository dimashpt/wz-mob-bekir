import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Icon } from '../icon';
import { InputField } from './index';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['outlined', 'flat'],
    },
    dense: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    secret: {
      control: { type: 'boolean' },
    },
  },
  args: {
    mode: 'outlined',
    dense: true,
    disabled: false,
    error: false,
    loading: false,
    secret: false,
  },
} satisfies Meta<typeof InputField>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default input field
 */
export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

/**
 * Input field with label and description
 */
export const WithDescription: Story = {
  args: {
    label: 'Password',
    description: 'Must be at least 8 characters',
    placeholder: 'Enter your password',
  },
};

/**
 * Input field with errors
 */
export const WithErrors: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: true,
    errors: ['Invalid email format'],
  },
};

/**
 * Input field with helpers
 */
export const WithHelpers: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    helpers: ['Must be unique', '3-20 characters'],
  },
};

/**
 * Input field with left icon
 */
export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    left: <Icon name="info" size={20} className="text-foreground-muted" />,
  },
};

/**
 * Input field with right icon
 */
export const WithRightIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    right: <Icon name="close" size={20} className="text-foreground-muted" />,
  },
};

/**
 * Password input field
 */
export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secret: true,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    loading: true,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: 'user@example.com',
    disabled: true,
  },
};

/**
 * Mandatory field
 */
export const Mandatory: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    mandatory: true,
  },
};
