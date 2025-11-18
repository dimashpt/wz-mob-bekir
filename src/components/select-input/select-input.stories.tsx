import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { SelectInput } from './index';

const meta = {
  title: 'Components/SelectInput',
  component: SelectInput,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    label: 'Select Option',
    placeholder: 'Choose an option',
  },
} satisfies Meta<typeof SelectInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default select input component
 */
export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ],
    onSelect: () => {},
  },
};

/**
 * Select input with selected value
 */
export const WithSelected: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ],
    selected: { value: 'us', label: 'United States' },
    onSelect: () => {},
  },
};

/**
 * Select input with options that have details
 */
export const WithDetails: Story = {
  args: {
    label: 'Plan',
    placeholder: 'Select a plan',
    options: [
      { value: 'basic', label: 'Basic', detail: '$9/month' },
      { value: 'pro', label: 'Pro', detail: '$19/month' },
      { value: 'enterprise', label: 'Enterprise', detail: '$49/month' },
    ],
    onSelect: () => {},
  },
};

/**
 * Mandatory select input
 */
export const Mandatory: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    mandatory: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ],
    onSelect: () => {},
  },
};
