# Configuration

This document covers environment variables, app configuration, and platform-specific settings for the mobile app.

## Environment Variables

Environment variables are managed using `.env.local` file in the root directory. This file is gitignored for security.

### Required Variables

Create a `.env.local` file with the following variables:

```env
# Google Maps API Key (required for maps functionality)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Google Services configuration file path
GOOGLE_SERVICES_JSON=./google-services.json

# App variant for different build configurations
APP_VARIANT=development  # development | preview | production
```

### Environment Variable Types

#### Public Variables (Client-side)
Variables prefixed with `EXPO_PUBLIC_` are embedded in the client bundle and accessible at runtime:

```typescript
// Accessible in the app
const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
```

#### Build-time Variables
Variables without the prefix are only available during build time:

```javascript
// Only available in app.config.ts
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;
```

### Security Best Practices

**❌ NEVER:**
- Commit `.env.local` to version control
- Share API keys in public channels
- Include secrets in the client bundle unnecessarily

**✅ ALWAYS:**
- Use `.env.local` for local development
- Set environment variables in your CI/CD pipeline
- Use different API keys for development/production
- Rotate API keys regularly

### Setting Up Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (if using place search)
4. Create credentials (API Key)
5. Restrict the API key:
   - **Android**: Add your app's package name and SHA-1 certificate fingerprint
   - **iOS**: Add your app's bundle identifier
6. Add the key to `.env.local`:
   ```env
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

## App Configuration

The main app configuration is in `app.config.ts`. This file is TypeScript-based for better type safety and dynamic configuration.

### Version Management

```typescript
// app.config.ts
const VERSION = '2.3.0';           // App version (semver)
const BUILD_NUMBER = 45;            // Incremental build number

export default {
  version: VERSION,
  ios: {
    buildNumber: BUILD_NUMBER.toString(),
  },
  android: {
    versionCode: BUILD_NUMBER,
  },
};
```

**Notes:**
- `VERSION` is the semantic version shown to users (e.g., "2.3.0")
- `BUILD_NUMBER` is an integer that must increment with each release
- iOS uses `buildNumber` (string), Android uses `versionCode` (integer)
- Both use the same `BUILD_NUMBER` constant for consistency

### App Variants

The app supports three variants for different environments:

```typescript
const APP_VARIANT = process.env.APP_VARIANT || 'development';

const variants = {
  development: {
    name: 'App Dev',
    bundleIdentifier: 'com.waizly.app.dev',
    icon: './src/assets/images/icon-ios-dev.icon',
  },
  preview: {
    name: 'App Preview',
    bundleIdentifier: 'com.waizly.app.preview',
    icon: './src/assets/images/icon-ios-preview.icon',
  },
  production: {
    name: 'Mobile App',
    bundleIdentifier: 'com.waizly.app.id',
    icon: './src/assets/images/icon-ios.icon',
  },
};
```

Each variant has:
- Unique display name
- Distinct bundle identifier/package name
- Custom app icons
- Separate configurations

### Platform-Specific Settings

#### iOS Configuration

```typescript
ios: {
  buildNumber: BUILD_NUMBER.toString(),
  bundleIdentifier: getBundleIdentifier(),
  supportsTablet: true,
  infoPlist: {
    NSCameraUsageDescription: 'Camera access for attendance check-in',
    NSLocationWhenInUseUsageDescription: 'Location access for attendance tracking',
    // ... other permissions
  },
  associatedDomains: [
    'applinks:app.example.com',
    'applinks:*.app.example.com',
  ],
  config: {
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
}
```

**Key Settings:**
- **buildNumber**: Build version number (string)
- **bundleIdentifier**: Unique app identifier (reverse domain)
- **supportsTablet**: Enable iPad support
- **infoPlist**: iOS-specific permissions and settings
- **associatedDomains**: Universal Links configuration
- **config.googleMapsApiKey**: Google Maps API key for iOS

#### Android Configuration

```typescript
android: {
  versionCode: BUILD_NUMBER,
  package: getPackageName(),
  adaptiveIcon: {
    foregroundImage: './src/assets/images/adaptive-icon.png',
    backgroundColor: '#FFFFFF',
  },
  permissions: [
    'CAMERA',
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    // ... other permissions
  ],
  intentFilters: [
    {
      action: 'VIEW',
      autoVerify: true,
      data: [
        {
          scheme: 'https',
          host: 'app.example.com',
          pathPrefix: '/reset-password',
        },
      ],
      category: ['BROWSABLE', 'DEFAULT'],
    },
  ],
  config: {
    googleMaps: {
      apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
}
```

**Key Settings:**
- **versionCode**: Build version number (integer)
- **package**: Unique app identifier (reverse domain)
- **adaptiveIcon**: Adaptive icon for Android 8+
- **permissions**: Required Android permissions
- **intentFilters**: App Links configuration
- **config.googleMaps.apiKey**: Google Maps API key for Android

### Expo Configuration

```typescript
{
  name: getAppName(),
  slug: 'mobile-app',
  scheme: 'app',
  owner: 'waizly',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  newArchitecture: true,
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
}
```

**Key Features Enabled:**
- **New Architecture**: React Native's new architecture (Fabric)
- **Typed Routes**: Type-safe navigation with Expo Router

### Plugin Configuration

The app uses various Expo and community plugins:

```typescript
plugins: [
  'expo-router',
  'expo-font',
  'expo-localization',
  'expo-secure-store',
  [
    'expo-camera',
    {
      cameraPermission: 'Allow camera access for attendance check-in',
    },
  ],
  [
    'expo-location',
    {
      locationAlwaysAndWhenInUsePermission: 'Allow location access for attendance tracking',
    },
  ],
  // ... more plugins
]
```

## Google Services Configuration

### Android - google-services.json

1. Download `google-services.json` from Firebase Console
2. Place it in the root directory: `./google-services.json`
3. The file is referenced in `app.config.ts`:
   ```typescript
   googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
   ```

**Note**: This file contains Firebase configuration and should not be committed to version control if it contains sensitive data.

### iOS - GoogleService-Info.plist

For iOS, the Google Services configuration is handled automatically by Expo during the build process using the same Firebase project.

## Sentry Configuration

Error tracking is configured in `app.config.ts`:

```typescript
{
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'your-org',
          project: 'mobile-app',
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
}
```

**Setup:**
1. Create a Sentry account and project
2. Get your auth token from Sentry
3. Add to your environment:
   ```env
   SENTRY_AUTH_TOKEN=your_token_here
   ```

## Deep Linking Configuration

### Universal Links (iOS) and App Links (Android)

The app supports deep linking for features like password reset:

**iOS (Associated Domains):**
```typescript
associatedDomains: [
  'applinks:app.example.com',
  'applinks:*.app.example.com',
]
```

**Android (Intent Filters):**
```typescript
intentFilters: [
  {
    action: 'VIEW',
    autoVerify: true,
    data: [
      {
        scheme: 'https',
        host: 'mobile-app.app',
        pathPrefix: '/reset-password',
      },
    ],
    category: ['BROWSABLE', 'DEFAULT'],
  },
]
```

**Example URLs:**
- `https://app.example.com/reset-password?token=abc123`
- `app://reset-password?token=abc123` (custom scheme)

## Environment-Specific Configuration

### Development

```env
APP_VARIANT=development
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_dev_api_key
```

### Preview/Staging

```env
APP_VARIANT=preview
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_preview_api_key
```

### Production

```env
APP_VARIANT=production
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_prod_api_key
```

## CI/CD Configuration

For continuous integration and deployment, set environment variables in your CI/CD platform:

**GitHub Actions:**
```yaml
env:
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}
  APP_VARIANT: production
```

**EAS Build Secrets:**
```bash
# Set secrets for EAS builds
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "your_key"
```

## Troubleshooting

### Environment Variables Not Working

1. Restart the development server after changing `.env.local`
2. Clear Metro cache: `bun start --clear`
3. Ensure variable names are correct (case-sensitive)
4. For public variables, ensure they start with `EXPO_PUBLIC_`

### Google Maps Not Showing

1. Verify API key is correct
2. Check API key restrictions (bundle ID/package name)
3. Ensure Maps SDK is enabled in Google Cloud Console
4. Check network connectivity and API quotas

### Build Configuration Issues

1. Run `bun prebuild --clean` to regenerate native projects
2. Check `app.config.ts` for syntax errors
3. Verify all required environment variables are set
4. Review native project files after prebuild

## Next Steps

- Review [Building](./BUILDING.md) for build configuration
- See [Development](./DEVELOPMENT.md) for development workflow
- Check [Getting Started](./GETTING_STARTED.md) for initial setup
