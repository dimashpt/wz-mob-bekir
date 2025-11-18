# Storybook Guide

This guide covers Storybook setup, story writing, and best practices for the mobile app component library.

## Overview

Storybook is a tool for developing UI components in isolation. It allows you to:
- Develop and test components independently
- Document components with interactive examples
- Showcase all possible states and variations of a component
- Facilitate design and development collaboration

The project uses **Storybook 10** for React Native with on-device controls and actions addons.

## Getting Started

### Installation

Storybook is already installed as a dev dependency. The configuration is in the `.rnstorybook/` directory.

### Project Structure

```
.rnstorybook/
├── main.ts           # Main configuration file
├── preview.tsx       # Global preview settings
├── index.ts          # Entry point
└── storybook.requires.ts  # Auto-generated story references
```

## Running Storybook

### Start Storybook Server

```bash
# Generate story references
bun storybook-generate

# Start Storybook (in development)
bun dev
```

Then select the Storybook app option in the Expo menu or open it in your simulator.

### Generate Stories

The project uses `sb-rn-get-stories` to automatically discover and register stories:

```bash
bun storybook-generate
```

This command scans for all `.stories.ts` and `.stories.tsx` files and generates the story registry.

## Writing Stories

### Story File Location

Stories should be placed alongside the component they document:

```
src/components/button/
├── index.tsx           # Component
├── types.ts            # Component types
└── button.stories.tsx  # Story file
```

Alternatively, use a `__stories__` directory:

```
src/components/button/
├── index.tsx
├── types.ts
└── __stories__/
    └── button.stories.tsx
```

### Basic Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Button } from './index';

// Define metadata
const meta = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View className="flex-1 justify-center items-center p-md bg-background">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    label: 'Click me',
    onPress: () => {},
  },
} satisfies Meta<typeof Button>;

export default meta;

// Define story type
type Story = StoryObj<typeof meta>;

/**
 * Default button variant
 */
export const Default: Story = {
  args: {
    label: 'Button',
  },
};

/**
 * Filled variant
 */
export const Filled: Story = {
  args: {
    label: 'Filled Button',
    variant: 'filled',
  },
};

/**
 * Outlined variant
 */
export const Outlined: Story = {
  args: {
    label: 'Outlined Button',
    variant: 'outlined',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Large size button
 */
export const Large: Story = {
  args: {
    label: 'Large Button',
    size: 'large',
  },
};

/**
 * With icon
 */
export const WithIcon: Story = {
  args: {
    label: 'Button with Icon',
    icon: 'check',
  },
};
```

### Story Structure Best Practices

#### 1. Meta Configuration

```typescript
const meta = {
  // 1. Title defines the hierarchy in the sidebar
  title: 'Components/Form/TextInput',

  // 2. Component reference
  component: TextInput,

  // 3. Decorators for layout/context
  decorators: [
    (Story) => (
      <View className="p-md bg-background">
        <Story />
      </View>
    ),
  ],

  // 4. Default props for all stories
  args: {
    label: 'Input',
    placeholder: 'Enter text',
  },

  // 5. Tags for documentation
  tags: ['autodocs'],
} satisfies Meta<typeof TextInput>;
```

#### 2. Story Variations

```typescript
/**
 * Default state - most common usage
 */
export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'user@example.com',
  },
};

/**
 * With error state
 */
export const WithError: Story = {
  args: {
    label: 'Email',
    error: true,
    errorMessage: 'Invalid email format',
  },
};

/**
 * With help text
 */
export const WithHelpText: Story = {
  args: {
    label: 'Password',
    helpText: 'Minimum 8 characters required',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
  },
};

/**
 * Multiple inputs (using render)
 */
export const Multiple: Story = {
  render: () => (
    <View className="gap-md">
      <TextInput label="First name" />
      <TextInput label="Last name" />
      <TextInput label="Email" />
    </View>
  ),
};
```

#### 3. Using Decorators

Decorators wrap your story with providers and layout:

```typescript
const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [
    // Provide consistent spacing and background
    (Story) => (
      <View className="flex-1 justify-center items-center p-lg bg-background">
        <Story />
      </View>
    ),
    // Or provide multiple decorators
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Card>;
```

#### 4. Using Args Controls

```typescript
const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    label: 'New',
    variant: 'primary',
    size: 'medium',
  },
  argTypes: {
    variant: {
      description: 'Badge color variant',
      options: ['primary', 'success', 'warning', 'error'],
      control: { type: 'select' },
    },
    size: {
      description: 'Badge size',
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Badge>;
```

### Using Actions

Track user interactions in Storybook:

```typescript
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/MenuItem',
  component: MenuItem,
  args: {
    label: 'Menu Item',
    onPress: fn(), // Track onPress calls
  },
} satisfies Meta<typeof MenuItem>;

export const Default: Story = {
  args: {
    label: 'Edit Profile',
    onPress: fn(),
  },
};
```

### Story Naming Conventions

```typescript
// ✅ DO: Use clear, descriptive names
export const Default: Story = {};
export const Disabled: Story = {};
export const WithError: Story = {};
export const Large: Story = {};
export const DarkMode: Story = {};

// ❌ DON'T: Use vague names
export const Story1: Story = {};
export const Test: Story = {};
export const Example: Story = {};
```

## Component Example Stories

### Text Component

```typescript
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'Hello, World!',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Heading1: Story = {
  args: {
    variant: 'heading1',
    children: 'Heading 1',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'heading2',
    children: 'Heading 2',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'Body text',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Caption text',
  },
};
```

### Card Component with Context

```typescript
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Card } from './index';
import { Text } from '@/components/text';

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [
    (Story) => (
      <View className="flex-1 justify-center items-center p-md bg-background">
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <Text variant="heading3">Card Title</Text>
      <Text variant="body">Card content goes here</Text>
    </Card>
  ),
};

export const WithPadding: Story = {
  args: {
    padding: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <Text variant="body">Padded card content</Text>
    </Card>
  ),
};

export const Pressable: Story = {
  render: () => (
    <Card onPress={() => console.log('Pressed')}>
      <Text variant="heading3">Pressable Card</Text>
      <Text variant="body">Tap me!</Text>
    </Card>
  ),
};
```

## Best Practices

### DO:

✅ **Write clear story names and descriptions**
```typescript
/**
 * Error state of the input field
 * Shows red border and error message
 */
export const WithError: Story = {};
```

✅ **Test all component states**
```typescript
export const Default: Story = {};
export const Loading: Story = {};
export const Error: Story = {};
export const Success: Story = {};
export const Disabled: Story = {};
```

✅ **Use meaningful args**
```typescript
export const LoggedIn: Story = {
  args: {
    user: { name: 'John Doe', role: 'admin' },
    isLoggedIn: true,
  },
};
```

✅ **Provide proper decorators for context**
```typescript
decorators: [
  (Story) => (
    <SafeAreaView>
      <Story />
    </SafeAreaView>
  ),
]
```

✅ **Document complex components thoroughly**
```typescript
/**
 * Attendance card showing daily attendance record
 *
 * Features:
 * - Check-in and check-out times
 * - Attendance status indicator
 * - Expandable details
 *
 * @example
 * <AttendanceCard attendance={mockAttendance} />
 */
export const Default: Story = {};
```

### DON'T:

❌ **Don't skip story documentation**
```typescript
// Bad
export const Variant1: Story = {};

// Good
export const WithBorder: Story = {};
```

❌ **Don't use hardcoded test data in stories**
```typescript
// Bad
export const User: Story = {
  args: {
    user: { id: '123', name: 'Test User' }
  },
};

// Good - Use factories
export const User: Story = {
  args: {
    user: createMockUser()
  },
};
```

❌ **Don't create too many irrelevant variations**
```typescript
// Avoid creating a story for every single prop combination
// Focus on meaningful, user-facing variations
```

❌ **Don't make stories dependent on real API calls**
```typescript
// Bad
export const List: Story = {
  args: {
    items: [] // Will fetch from API
  },
};

// Good - Mock the data
export const List: Story = {
  args: {
    items: mockItems
  },
};
```

## Story Organization

### Folder Structure for Stories

Keep stories close to components:

```
src/components/
├── button/
│   ├── index.tsx
│   ├── types.ts
│   └── button.stories.tsx
├── card/
│   ├── index.tsx
│   └── card.stories.tsx
└── form/
    ├── input/
    │   ├── index.tsx
    │   └── input.stories.tsx
    └── select/
        ├── index.tsx
        └── select.stories.tsx
```

### Story Title Hierarchy

Use titles to organize in Storybook sidebar:

```
Components/Button
Components/Card
Components/Form/Input
Components/Form/Select
Components/Layout/Container
Screens/Attendance/Detail
Screens/Leave/Request
```

## Storybook Addons

The project includes two essential addons:

### 1. On-Device Controls

Allows you to change component props in real-time using the Storybook UI:

```typescript
const meta = {
  title: 'Components/Button',
  component: Button,
  // Controls addon will automatically generate controls for these args
  args: {
    label: 'Button',
    variant: 'filled',
    size: 'medium',
    disabled: false,
  },
} satisfies Meta<typeof Button>;
```

### 2. On-Device Actions

Tracks function calls and interactions:

```typescript
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    onPress: fn(), // Action tracked
  },
} satisfies Meta<typeof Button>;
```

## Regenerating Stories

After creating new story files, regenerate the story registry:

```bash
bun storybook-generate
```

This updates `.rnstorybook/storybook.requires.ts` with all discovered stories.

## Tips & Tricks

### Using Render Function

For complex story variations, use the `render` function:

```typescript
export const ComplexExample: Story = {
  render: (args) => (
    <View className="gap-md">
      <Component {...args} />
      <Component {...args} disabled={true} />
      <Component {...args} loading={true} />
    </View>
  ),
};
```

### Accessing Theme Colors

Use CSS variables for theming:

```typescript
import { useCSSVariable } from 'uniwind';

export const ThemedButton: Story = {
  render: () => {
    const primaryColor = useCSSVariable('--color-primary');
    // Use color in story
  },
};
```

### Story Args Type Safety

Use TypeScript for type-safe args:

```typescript
type ButtonStoryArgs = React.ComponentProps<typeof Button>;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    label: 'Button',
  } satisfies ButtonStoryArgs,
} satisfies Meta<typeof Button>;
```

## Viewing Stories

Open the Storybook app in your simulator after running:

```bash
bun dev
```

Then navigate through:
- **Component Library**: Browse all components
- **Controls**: Adjust props in real-time
- **Actions**: View function calls
- **Source**: See component code

## Next Steps

- Review [Development Guide](./DEVELOPMENT.md) for component development standards
- See [Testing](./TESTING.md) for testing components
- Check [Project Structure](./PROJECT_STRUCTURE.md) for code organization

## Resources

- [Storybook React Native Documentation](https://storybook.js.org/docs/react-native/get-started/introduction)
- [Story File Format](https://storybook.js.org/docs/react-native/api/csf)
- [Decorators](https://storybook.js.org/docs/react-native/writing-stories/decorators)
- [Args and Controls](https://storybook.js.org/docs/react-native/writing-stories/args)
