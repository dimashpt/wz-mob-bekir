import type { Meta, StoryObj } from '@storybook/react-native';

import { useState } from 'react';
import { View } from 'react-native';

import { InputField } from '../input-field';
import { PasswordComplexity } from './index';

const meta = {
  title: 'Components/PasswordComplexity',
  component: PasswordComplexity,
  decorators: [
    (Story) => (
      <View className="p-lg bg-surface rounded-md">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    password: '',
    visible: true,
  },
} satisfies Meta<typeof PasswordComplexity>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default password complexity component
 */
export const Default: Story = {
  args: {},
  render: () => {
    const [password, setPassword] = useState('');
    return (
      <View className="gap-md">
        <View className="relative">
          <InputField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secret
          />
          <PasswordComplexity
            password={password}
            visible={password.length > 0}
          />
        </View>
      </View>
    );
  },
};

/**
 * Password complexity with valid password
 */
export const ValidPassword: Story = {
  args: {},
  render: () => {
    return (
      <View className="gap-md">
        <View className="relative">
          <InputField
            label="Password"
            placeholder="Enter password"
            value="Password123!"
            secret
          />
          <PasswordComplexity password="Password123!" visible={true} />
        </View>
      </View>
    );
  },
};

/**
 * Password complexity hidden
 */
export const Hidden: Story = {
  args: {},
  render: () => {
    const [password, setPassword] = useState('');
    return (
      <View className="gap-md">
        <View className="relative">
          <InputField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secret
          />
          <PasswordComplexity password={password} visible={false} />
        </View>
      </View>
    );
  },
};
