import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { Text } from './index';

const meta = {
  title: 'Components/Text',
  component: Text,
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
      options: [
        'headingXS',
        'headingS',
        'headingM',
        'headingL',
        'headingXL',
        'labelXS',
        'labelS',
        'labelM',
        'labelL',
        'labelXL',
        'bodyXS',
        'bodyS',
        'bodyM',
        'bodyL',
        'bodyXL',
      ],
    },
    color: {
      control: { type: 'radio' },
      options: [
        'default',
        'light',
        'dark',
        'muted',
        'accent',
        'success',
        'warning',
        'danger',
        'placeholder',
      ],
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  args: {
    variant: 'bodyM',
    color: 'default',
    loading: false,
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default text component
 */
export const Default: Story = {
  args: {
    children: 'This is a text component',
  },
};

/**
 * Heading Variants
 */
export const HeadingXS: Story = {
  args: {
    variant: 'headingXS',
    children: 'Heading XS',
  },
};

export const HeadingS: Story = {
  args: {
    variant: 'headingS',
    children: 'Heading S',
  },
};

export const HeadingM: Story = {
  args: {
    variant: 'headingM',
    children: 'Heading M',
  },
};

export const HeadingL: Story = {
  args: {
    variant: 'headingL',
    children: 'Heading L',
  },
};

export const HeadingXL: Story = {
  args: {
    variant: 'headingXL',
    children: 'Heading XL',
  },
};

/**
 * Label Variants
 */
export const LabelXS: Story = {
  args: {
    variant: 'labelXS',
    children: 'Label XS',
  },
};

export const LabelS: Story = {
  args: {
    variant: 'labelS',
    children: 'Label S',
  },
};

export const LabelM: Story = {
  args: {
    variant: 'labelM',
    children: 'Label M',
  },
};

export const LabelL: Story = {
  args: {
    variant: 'labelL',
    children: 'Label L',
  },
};

export const LabelXL: Story = {
  args: {
    variant: 'labelXL',
    children: 'Label XL',
  },
};

/**
 * Body Variants
 */
export const BodyXS: Story = {
  args: {
    variant: 'bodyXS',
    children: 'Body XS - This is extra small text',
  },
};

export const BodyS: Story = {
  args: {
    variant: 'bodyS',
    children: 'Body S - This is small text',
  },
};

export const BodyM: Story = {
  args: {
    variant: 'bodyM',
    children: 'Body M - This is medium text (default)',
  },
};

export const BodyL: Story = {
  args: {
    variant: 'bodyL',
    children: 'Body L - This is large text',
  },
};

export const BodyXL: Story = {
  args: {
    variant: 'bodyXL',
    children: 'Body XL - This is extra large text',
  },
};

/**
 * Color Variants
 */
export const ColorDefault: Story = {
  args: {
    color: 'default',
    children: 'Default color',
  },
};

export const ColorLight: Story = {
  args: {
    color: 'light',
    children: 'Light color',
  },
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
};

export const ColorDark: Story = {
  args: {
    color: 'dark',
    children: 'Dark color',
  },
};

export const ColorMuted: Story = {
  args: {
    color: 'muted',
    children: 'Muted color',
  },
};

export const ColorAccent: Story = {
  args: {
    color: 'accent',
    children: 'Accent color',
  },
};

export const ColorSuccess: Story = {
  args: {
    color: 'success',
    children: 'Success color',
  },
};

export const ColorWarning: Story = {
  args: {
    color: 'warning',
    children: 'Warning color',
  },
};

export const ColorDanger: Story = {
  args: {
    color: 'danger',
    children: 'Danger color',
  },
};

export const ColorPlaceholder: Story = {
  args: {
    color: 'placeholder',
    children: 'Placeholder color',
  },
};

/**
 * Loading State with Skeleton
 */
export const Loading: Story = {
  args: {
    loading: true,
    variant: 'bodyM',
  },
};

export const LoadingHeading: Story = {
  args: {
    loading: true,
    variant: 'headingM',
  },
};

/**
 * All Variants Showcase
 */
export const AllVariants: Story = {
  args: {},
  render: () => (
    <View className="gap-sm">
      <Text variant="headingXS">Heading XS</Text>
      <Text variant="headingS">Heading S</Text>
      <Text variant="headingM">Heading M</Text>
      <Text variant="headingL">Heading L</Text>
      <Text variant="headingXL">Heading XL</Text>

      <View className="my-xs h-px bg-[#ddd]" />

      <Text variant="labelXS">Label XS</Text>
      <Text variant="labelS">Label S</Text>
      <Text variant="labelM">Label M</Text>
      <Text variant="labelL">Label L</Text>
      <Text variant="labelXL">Label XL</Text>

      <View className="my-xs h-px bg-[#ddd]" />

      <Text variant="bodyXS">Body XS - Extra small text</Text>
      <Text variant="bodyS">Body S - Small text</Text>
      <Text variant="bodyM">Body M - Medium text</Text>
      <Text variant="bodyL">Body L - Large text</Text>
      <Text variant="bodyXL">Body XL - Extra large text</Text>
    </View>
  ),
};

/**
 * All Colors Showcase
 */
export const AllColors: Story = {
  args: {},
  render: () => (
    <View className="gap-sm">
      <Text color="default">Default color</Text>
      <Text color="muted">Muted color</Text>
      <Text color="accent">Accent color</Text>
      <Text color="success">Success color</Text>
      <Text color="warning">Warning color</Text>
      <Text color="danger">Danger color</Text>
      <Text color="placeholder">Placeholder color</Text>
    </View>
  ),
};

/**
 * With Custom className
 */
export const WithCustomClassName: Story = {
  args: {
    variant: 'bodyM',
    color: 'default',
    className: 'font-bold',
    children: 'Text with custom className',
  },
};
