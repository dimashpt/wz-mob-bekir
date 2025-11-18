import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Button } from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
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
      options: ['filled', 'outlined', 'ghost'],
    },
    color: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'danger', 'warning', 'success'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default button with primary color and filled variant
 */
export const Default: Story = {
  args: {
    text: 'Button',
  },
};

/**
 * Button variants
 */
export const Filled: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    text: 'Filled Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    text: 'Outlined Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    text: 'Ghost Button',
  },
};

/**
 * Button colors
 */
export const Primary: Story = {
  args: {
    color: 'primary',
    text: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    text: 'Secondary Button',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
    text: 'Danger Button',
  },
};

export const Warning: Story = {
  args: {
    color: 'warning',
    text: 'Warning Button',
  },
};

export const Success: Story = {
  args: {
    color: 'success',
    text: 'Success Button',
  },
};

/**
 * Button sizes
 */
export const Small: Story = {
  args: {
    size: 'small',
    text: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    text: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    text: 'Large Button',
  },
};

/**
 * Button states
 */
export const Disabled: Story = {
  args: {
    text: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    text: 'Loading Button',
    loading: true,
  },
};

/**
 * Button with icons
 */
export const WithPrefixIcon: Story = {
  args: {
    text: 'With Prefix Icon',
    prefixIcon: 'arrow',
  },
};

export const WithSuffixIcon: Story = {
  args: {
    text: 'With Suffix Icon',
    suffixIcon: 'chevron',
  },
};

export const IconOnly: Story = {
  args: {
    icon: 'plus',
  },
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  args: {},
  render: () => (
    <View className="gap-sm">
      <Button variant="filled" color="primary" text="Filled Primary" />
      <Button variant="filled" color="danger" text="Filled Danger" />
      <Button variant="outlined" color="primary" text="Outlined Primary" />
      <Button variant="outlined" color="danger" text="Outlined Danger" />
      <Button variant="ghost" color="primary" text="Ghost Primary" />
      <Button variant="ghost" color="danger" text="Ghost Danger" />
    </View>
  ),
};
