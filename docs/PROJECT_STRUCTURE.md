# Project Structure

This document describes the organization and structure of the mobile app codebase.

## Directory Overview

```
mobile-app/
├── src/                      # Source code directory
│   ├── app/                  # Main application screens (Expo Router)
│   ├── components/           # Reusable UI components
│   ├── screens/              # Screen components organized by feature
│   ├── assets/               # Static assets
│   ├── constants/            # App constants and configurations
│   ├── hooks/                # Custom React hooks
│   ├── @types/               # TypeScript type definitions
│   ├── lib/                  # Core libraries and providers
│   ├── locales/              # Internationalization files
│   ├── services/             # API services and repositories
│   ├── store/                # State management
│   ├── theme/                # Design system and theming
│   └── utils/                # Utility functions
├── scripts/                  # Build and utility scripts
├── android/                  # Android platform files
├── ios/                      # iOS platform files
├── coverage/                 # Test coverage reports
├── dist/                     # Build output directory
└── node_modules/             # Dependencies
```

## Detailed Structure

### `/src/app` - Application Routes

File-based routing powered by Expo Router. The structure of this directory defines the navigation structure of the app.

```
src/app/
├── _layout.tsx               # Root layout with providers
├── (stack)/                  # Stack-based navigation
│   ├── (guarded)/            # Authenticated screens
│   │   ├── _layout.tsx       # Auth guard layout
│   │   ├── approval/         # Approval screens
│   │   ├── attendance/       # Attendance screens
│   │   ├── leave/            # Leave management screens
│   │   ├── overtime/         # Overtime screens
│   │   └── ...               # Other authenticated features
│   └── (unguarded)/          # Public screens
│       ├── login.tsx         # Login screen
│       ├── forgot-password.tsx
│       └── ...
└── (tab)/                    # Tab-based navigation
    ├── _layout.tsx           # Tab navigator layout
    ├── index.tsx             # Home tab
    ├── attendance.tsx        # Attendance tab
    ├── approvals.tsx         # Approvals tab
    └── profile.tsx           # Profile tab
```

**Key Features:**
- File-based routing (like Next.js)
- Grouped routes with `(folder)` syntax
- Nested layouts for different navigation patterns
- Type-safe navigation with typed routes

### `/src/components` - Reusable Components

Organized by component type and functionality:

```
src/components/
├── index.ts                  # Component exports
├── action-item/              # Action item components
├── attachment-item/          # File attachment components
├── attendance-card/          # Attendance display cards
├── banner/                   # Banner components
├── bottom-sheet/             # Bottom sheet modals
├── button/                   # Button variants
├── chip/                     # Chip/tag components
├── clickable/                # Touchable wrappers
├── container/                # Layout containers
├── date-picker/              # Date/time pickers
└── ...                       # More components
```

**Component Structure:**
Each component folder typically contains:
- `index.tsx` - Main component
- `types.ts` - TypeScript types (if complex)
- `styles.ts` - Component styles (if using separate file)

### `/src/screens` - Feature Screens

Screen components organized by feature domain:

```
src/screens/
├── attendance/
│   ├── AttendanceHistoryScreen.tsx
│   ├── AttendanceDetailScreen.tsx
│   └── CheckInScreen.tsx
├── leave/
│   ├── LeaveListScreen.tsx
│   ├── LeaveRequestScreen.tsx
│   └── LeaveDetailScreen.tsx
├── approval/
├── overtime/
├── payslip/
└── ...
```

### `/src/assets` - Static Assets

```
src/assets/
├── animations/               # Lottie JSON animations
│   ├── loading.json
│   └── success.json
├── icons/                    # SVG icon assets
│   ├── home.svg
│   ├── profile.svg
│   └── ...
├── illustrations/            # Illustration assets
│   ├── empty-state.svg
│   └── onboarding.svg
└── images/                   # Image assets
    ├── app-icon.png
    ├── splash.png
    └── ...
```

### `/src/services` - API Services

API integration layer using repository pattern:

```
src/services/
├── approval/
│   ├── index.ts              # Service exports
│   ├── repository.ts         # API calls
│   └── types.ts              # Type definitions
├── attendance/
│   ├── index.ts
│   ├── repository.ts
│   └── types.ts
├── auth/
├── leave/
└── ...
```

**Service Structure:**
- `repository.ts` - Axios API calls
- `types.ts` - Request/response types
- `index.ts` - Service hooks using React Query

### `/src/store` - State Management

Global state management using Zustand:

```
src/store/
├── auth.ts                   # Authentication state
├── user.ts                   # User data state
├── notifications.ts          # Notification state
└── ...
```

### `/src/@types` - TypeScript Definitions

Type definitions organized by domain:

```
src/@types/
├── api.d.ts                  # API response types
├── approval-request.d.ts     # Approval types
├── attendance.d.ts           # Attendance types
├── leave.d.ts                # Leave types
├── theme.d.ts                # Theme types
├── svg.d.ts                  # SVG module declarations
└── ...
```

### `/src/theme` - Design System

Theme configuration and design tokens:

```
src/theme/
├── index.ts                  # Main theme export
├── themes.ts                 # Theme definitions (legacy, for reference)
├── typography.ts             # Typography
└── elevation.ts              # Elevation/shadows
```

**Note**: The project has migrated from React Native Unistyles to **Uniwind** (Tailwind CSS). Design tokens are now defined as CSS variables in `src/assets/styles/global.css` and accessed via `useCSSVariable()` hook from `uniwind`.

### `/src/assets/styles` - Global Styles

Tailwind CSS configuration and design tokens:

```
src/assets/styles/
└── global.css                # Tailwind CSS configuration
```

The `global.css` file contains:
- Tailwind CSS imports (`@import 'tailwindcss'`, `@import 'uniwind'`)
- CSS custom properties for design tokens
- Theme variants (light/dark mode)
- Static theme definitions using `@theme static`

### `/src/locales` - Internationalization

Translation files for multi-language support:

```
src/locales/
├── en/                       # English translations
│   ├── common.json
│   ├── attendance.json
│   ├── leave.json
│   └── ...
└── id/                       # Indonesian translations
    ├── common.json
    ├── attendance.json
    ├── leave.json
    └── ...
```

### `/src/hooks` - Custom Hooks

Reusable React hooks:

```
src/hooks/
├── useAuth.ts                # Authentication hook
├── usePermissions.ts         # Permission checking
├── useLocation.ts            # Location services
├── useCamera.ts              # Camera access
└── ...
```

### `/src/utils` - Utility Functions

Helper functions and utilities:

```
src/utils/
├── date.ts                   # Date formatting/parsing
├── validation.ts             # Input validation
├── storage.ts                # Async storage helpers
├── permissions.ts            # Permission utilities
└── ...
```

### `/src/constants` - Constants

Application-wide constants:

```
src/constants/
├── config.ts                 # App configuration
├── api.ts                    # API endpoints
├── permissions.ts            # Permission constants
└── ...
```

## Build and Configuration Files

```
mobile-app/
├── app.config.ts             # Expo app configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler config
├── tsconfig.json             # TypeScript config
├── eslint.config.js          # ESLint config
├── package.json              # Dependencies and scripts
├── eas.json                  # EAS Build configuration
└── .env.local                # Environment variables (gitignored)
```

## Navigation Architecture

The app uses **Expo Router** with a nested navigation structure:

1. **Root Layout** (`_layout.tsx`) - Global providers and configuration
2. **Stack Navigation** (`(stack)/_layout.tsx`) - Modal and push navigation
   - **Guarded Routes** - Protected by authentication
   - **Unguarded Routes** - Public access
3. **Tab Navigation** (`(tab)/_layout.tsx`) - Bottom tab navigation for main features

## Best Practices

### File Naming Conventions

- **Components**: PascalCase (e.g., `AttendanceCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files
- **Types**: PascalCase for interfaces/types
- **Routes**: kebab-case for file names (e.g., `forgot-password.tsx`)

### Import Organization

1. External dependencies (React, React Native, etc.)
2. Internal absolute imports (components, utils, etc.)
3. Relative imports
4. Type imports (separated if many)

### Component Organization

```typescript
// 1. Imports
import { ... } from 'react';

// 2. Types
interface Props { ... }

// 3. Component
export function MyComponent(props: Props) {
  // 4. Hooks
  // 5. Event handlers
  // 6. Render
}
```

## Next Steps

- Review [Development Guide](./DEVELOPMENT.md) for coding standards
- See [Configuration](./CONFIGURATION.md) for environment setup
- Check [Testing](./TESTING.md) for testing guidelines
