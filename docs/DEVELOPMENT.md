# Development Guide

This guide covers the development workflow, technologies, and best practices for the mobile app.

## Technology Stack

### Core Technologies

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Package Manager**: Bun

### UI & Styling

- **Styling**: Uniwind (Tailwind CSS for React Native)
- **UI Components**: React Native Paper
- **Bottom Sheets**: @gorhom/bottom-sheet
- **Animations**: React Native Reanimated, Lottie
- **Variant Management**: Tailwind Variants (tailwind-variants)

### Data & API

- **API Client**: Axios
- **Data Fetching**: TanStack React Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Zod

### Features & Integrations

- **Maps**: React Native Maps
- **Camera**: React Native Vision Camera with Face Detection
- **Internationalization**: i18next with react-i18next
- **Error Tracking**: Sentry
- **Performance**: React Native Performance monitoring

### Testing

- **Test Runner**: Jest
- **Testing Library**: React Native Testing Library
- **Coverage**: Istanbul (built into Jest)

## Available Scripts

### Development

```bash
# Start Expo development server
bun dev
# or
bun start

# Run on specific platform
bun ios          # Run on iOS simulator
bun android      # Run on Android emulator
bun web          # Run on web browser

# Generate native projects
bun prebuild     # Run expo prebuild
```

### Building

```bash
# Local development builds (faster, requires local setup)
bun build-dev-android       # Build development AAB locally
bun build-dev-ios           # Build development IPA locally
bun build-prod-android      # Build production AAB locally
bun build-prod-ios          # Build production IPA locally

# Remote EAS builds (slower but no local setup required)
bun build-dev-all-remote    # Build development for all platforms
bun build-prod-all-remote   # Build production for all platforms
```

### Code Quality

```bash
# Linting
bun lint                    # Run ESLint
bun lint --fix              # Fix auto-fixable issues

# Type checking
bun tsc                     # Run TypeScript compiler check
```

### Testing

```bash
# Run tests
bun test                    # Run all tests in watch mode
bun test:ci                 # Run tests once for CI

# Run specific test file
bun test path/to/test.test.tsx

# Coverage
bun test --coverage         # Generate coverage report
```

### Version Management

```bash
# Bump version
bun bump <version-type>     # See VERSIONING.md for details
bun bump patch              # 1.0.0 -> 1.0.1
bun bump minor              # 1.0.0 -> 1.1.0
bun bump major              # 1.0.0 -> 2.0.0
bun bump ota                # 1.0.0 -> 1.0.0-ota.1
```

## Development Workflow

### 1. Starting a New Feature

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Start development server
bun dev
```

### 2. Making Changes

- Follow the file structure conventions (see [Project Structure](./PROJECT_STRUCTURE.md))
- Use TypeScript for type safety
- Follow the component patterns in existing code
- Add translations to locale files for any user-facing text

### 3. Testing Your Changes

```bash
# Run the app on your preferred platform
bun ios       # or bun android

# Run tests
bun test

# Check code quality
bun lint
```

### 4. Committing Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(attendance): add face recognition"
git commit -m "fix(login): resolve authentication issue"
git commit -m "docs: update API documentation"
```

**Commit Types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes
- `build:` - Build system changes

### 5. Creating a Pull Request

```bash
# Push your changes
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots/videos for UI changes
- Test results
- Any breaking changes noted

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Use explicit types for function parameters and returns
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Use type for unions and primitives
type Status = 'pending' | 'approved' | 'rejected';

// ❌ Avoid 'any' type
const data: any = fetchData(); // Bad

// ✅ Use proper typing or unknown
const data: UserResponse = fetchData(); // Good
```

### Component Structure

```typescript
import React from 'react';
import { View, Text } from 'react-native';

// 1. Define props interface
interface AttendanceCardProps {
  attendance: Attendance;
  onPress?: () => void;
}

// 2. Define component
export function AttendanceCard({ attendance, onPress }: AttendanceCardProps) {
  // 3. Hooks
  const { t } = useTranslation();

  // 4. Event handlers
  const handlePress = () => {
    onPress?.();
  };

  // 5. Render
  return (
    <View>
      <Text>{t('attendance.title')}</Text>
    </View>
  );
}
```

### Styling

The project uses **Uniwind** (Tailwind CSS for React Native) for styling. Components use Tailwind utility classes via the `className` prop, and CSS variables for dynamic theming.

```typescript
// Using Tailwind classes with tailwind-variants
import { tv } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable } from 'uniwind';

const buttonVariants = tv({
  base: 'rounded-md items-center justify-center flex-row',
  variants: {
    variant: {
      filled: 'border-0',
      outlined: 'bg-transparent border-[1.5px]',
      ghost: 'bg-transparent border-0',
    },
    size: {
      small: 'px-sm py-xs min-h-[32px]',
      medium: 'px-md py-sm min-h-[44px]',
      large: 'px-xl py-lg min-h-[56px]',
    },
  },
  defaultVariants: {
    variant: 'filled',
    size: 'medium',
  },
});

export function MyComponent({ variant, size, className }: Props) {
  const buttonClassName = twMerge(
    buttonVariants({ variant, size }),
    className,
  );

  return <View className={buttonClassName} />;
}
```

**For dynamic colors in animations:**

```typescript
import { useCSSVariable } from 'uniwind';
import { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

export function AnimatedComponent() {
  const primaryColor = useCSSVariable('--color-primary') as string;
  const mutedColor = useCSSVariable('--color-foreground-muted') as string;

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [primaryColor, mutedColor],
    ),
  }));

  return <Animated.View style={animatedStyle} className="rounded-md p-md" />;
}
```

**Available CSS Variables:**

Colors, spacing, and other design tokens are defined in `src/assets/styles/global.css` and can be accessed via `useCSSVariable()`:
- Colors: `--color-primary`, `--color-success`, `--color-error`, `--color-foreground`, etc.
- Spacing: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, etc.
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, etc.

### API Services

```typescript
// repository.ts
import { api } from '@/lib/api';
import type { AttendanceResponse } from './types';

export const attendanceRepository = {
  getAttendanceHistory: async (params: { month: number; year: number }) => {
    const { data } = await api.get<AttendanceResponse>('/attendance/history', {
      params,
    });
    return data;
  },
};

// index.ts (hooks)
import { useQuery } from '@tanstack/react-query';
import { attendanceRepository } from './repository';

export function useAttendanceHistory(month: number, year: number) {
  return useQuery({
    queryKey: ['attendance', 'history', month, year],
    queryFn: () => attendanceRepository.getAttendanceHistory({ month, year }),
  });
}
```

## Performance Best Practices

### 1. Image Optimization

```typescript
// ✅ Use appropriate image formats
<Image source={require('./image.webp')} />

// ✅ Specify dimensions when possible
<Image
  source={{ uri: url }}
  style={{ width: 100, height: 100 }}
/>

// ✅ Use FastImage for network images (if installed)
<FastImage
  source={{ uri: url }}
  resizeMode="cover"
/>
```

### 2. List Optimization

```typescript
// ✅ Use FlatList for long lists
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  windowSize={10}
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
/>
```

### 3. Use Memoization When Needed

```typescript
// Use useCallback for functions passed to optimized child components
const handlePress = useCallback(() => {
  navigation.navigate('Detail', { id });
}, [id, navigation]);

// Use useMemo for expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(data);
}, [data]);
```

## Debugging

### Developer Menu

**iOS Simulator:**
- Press `Cmd+D` to open developer menu
- Shake the device (Hardware → Shake Gesture)

**Android Emulator:**
- Press `Cmd+M` (Mac) or `Ctrl+M` (Windows/Linux)
- Shake the device

### React Native Debugger

1. Install React Native Debugger
2. Open it before starting the app
3. Enable "Debug Remote JS" from developer menu

### Flipper (Alternative)

Flipper is integrated for debugging:
- Network inspector
- Layout inspector
- Logs viewer
- Redux/State inspector

### Sentry

Errors are automatically tracked in production:
- Check Sentry dashboard for production errors
- Errors include stack traces and user context

## Common Patterns

### Data Fetching

```typescript
function MyScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['key'],
    queryFn: fetchData,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return <DataView data={data} />;
}
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle submission
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </Form>
  );
}
```

### Navigation

```typescript
import { router } from 'expo-router';

// Navigate to a route
router.push('/attendance/detail');

// Navigate with parameters
router.push({
  pathname: '/attendance/[id]',
  params: { id: '123' },
});

// Go back
router.back();

// Replace current route
router.replace('/home');
```

## Internationalization

```typescript
// In component
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t('attendance.checkIn')}</Text>;
}

// In locale file (src/locales/en/attendance.json)
{
  "checkIn": "Check In",
  "checkOut": "Check Out"
}
```

## Next Steps

- Review [Building](./BUILDING.md) for production builds
- See [Testing](./TESTING.md) for testing guidelines
- Check [Configuration](./CONFIGURATION.md) for environment setup
- Read [Versioning](./VERSIONING.md) for version management
