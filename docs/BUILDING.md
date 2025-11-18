# Building

This guide covers building the mobile app for different environments and platforms.

## Overview

The app supports multiple build methods:
- **Local Builds**: Faster builds using your local machine
- **EAS Builds**: Cloud builds using Expo Application Services
- **Multiple Variants**: Development, Preview, and Production builds

## Build Variants

### Development
- **Purpose**: Internal testing and development
- **Bundle ID (iOS)**: `com.waizly.app.dev`
- **Package Name (Android)**: `com.waizly.app.dev`
- **App Name**: "App Dev"
- **Distribution**: Internal (TestFlight, Firebase App Distribution)
- **Features**: Debug enabled, development URLs

### Preview
- **Purpose**: Staging/testing before production
- **Bundle ID (iOS)**: `com.waizly.app.preview`
- **Package Name (Android)**: `com.waizly.app.preview`
- **App Name**: "App Preview"
- **Distribution**: Internal testing
- **Features**: Production-like environment for QA

### Production
- **Purpose**: App Store release
- **Bundle ID (iOS)**: `com.waizly.app.id`
- **Package Name (Android)**: `com.waizly.app.id`
- **App Name**: "Mobile App"
- **Distribution**: Public (App Store, Play Store)
- **Features**: Production environment, optimized

## EAS Build Configuration

Build profiles are configured in `eas.json`:

```json
{
  "build": {
    "development": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "preview"
      }
    },
    "production": {
      "distribution": "store",
      "env": {
        "APP_VARIANT": "production"
      }
    }
  }
}
```

## Local Builds

Local builds are faster and don't require EAS cloud services, but require platform-specific tooling installed on your machine.

### Prerequisites

#### For Android Local Builds
- Android Studio installed
- Android SDK and build tools
- Java Development Kit (JDK 17)
- Environment variables configured:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

#### For iOS Local Builds (macOS only)
- Xcode installed (latest stable version)
- Xcode Command Line Tools
- CocoaPods installed
- Apple Developer account
- Valid provisioning profiles and certificates

### Building Locally

#### Android Development Build (Local)

```bash
# Build development AAB (Android App Bundle)
bun build-dev-android

# This runs:
# eas build --profile development --platform android --local
```

**Output**: `./build-<timestamp>.aab` in the project root

**To install**:
```bash
# Convert AAB to APK (requires bundletool)
bundletool build-apks --bundle=./build.aab --output=./app.apks \
  --mode=universal

# Install APK
adb install ./app.apks
```

#### iOS Development Build (Local)

```bash
# Build development IPA
bun build-dev-ios

# This runs:
# eas build --profile development --platform ios --local
```

**Output**: `./build-<timestamp>.ipa` in the project root

**To install**:
- Use Xcode Devices window
- Use Apple Configurator
- Upload to TestFlight

#### Production Builds (Local)

```bash
# Android production build
bun build-prod-android

# iOS production build
bun build-prod-ios
```

### Local Build Advantages
- ✅ Faster build times (no upload/download)
- ✅ No EAS build minutes consumed
- ✅ Full control over build process
- ✅ Easier debugging of build issues

### Local Build Disadvantages
- ❌ Requires local tooling setup
- ❌ Platform-specific (can't build iOS on Windows/Linux)
- ❌ Uses your machine's resources
- ❌ Requires manual certificate/profile management

## Remote EAS Builds

Remote builds use Expo's cloud infrastructure. They're slower but require no local setup.

### Prerequisites

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to EAS**:
   ```bash
   eas login
   ```

3. **Configure Project**:
   ```bash
   eas build:configure
   ```

### Building with EAS

#### Development Builds (All Platforms)

```bash
# Build for all platforms using EAS cloud
bun build-dev-all-remote

# This runs:
# eas build --profile development --platform all
```

#### Production Builds (All Platforms)

```bash
# Build for all platforms
bun build-prod-all-remote

# This runs:
# eas build --profile production --platform all
```

#### Platform-Specific Remote Builds

```bash
# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview builds
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production builds
eas build --profile production --platform ios
eas build --profile production --platform android
```

### EAS Build Advantages
- ✅ No local tooling required
- ✅ Build on any OS (including iOS on Windows/Linux)
- ✅ Consistent build environment
- ✅ Automatic credential management
- ✅ Build logs and artifacts stored in cloud

### EAS Build Disadvantages
- ❌ Slower (upload + build + download)
- ❌ Consumes EAS build minutes
- ❌ Requires internet connection
- ❌ Limited free tier minutes

## Build Workflow

### 1. Pre-Build Checklist

Before building, ensure:

- [ ] All changes are committed
- [ ] Version is bumped (see [Versioning](./VERSIONING.md))
- [ ] Environment variables are configured
- [ ] Tests are passing
- [ ] Code is linted and formatted
- [ ] CHANGELOG is updated

### 2. Version Bump

```bash
# For store updates (native changes)
bun bump patch   # or minor, major

# For OTA updates (JavaScript only)
bun bump ota
```

This will:
- Update version numbers
- Generate changelog
- Create git tag
- Run expo prebuild
- Push to remote

### 3. Build

Choose your build method:

```bash
# Local development build (fast)
bun build-dev-android
bun build-dev-ios

# Remote build (no local setup needed)
bun build-dev-all-remote
```

### 4. Test Build

- Install on physical device or emulator
- Test critical user flows
- Verify environment configuration
- Check crash reporting
- Validate API endpoints

### 5. Distribute

#### Development Builds
- Firebase App Distribution
- TestFlight (iOS)
- Direct installation

#### Preview Builds
- TestFlight (iOS)
- Google Play Internal Testing (Android)
- Firebase App Distribution

#### Production Builds
- App Store submission (iOS)
- Google Play Store submission (Android)

## Platform-Specific Build Details

### iOS Builds

#### Certificates and Profiles

EAS automatically manages certificates and provisioning profiles. For manual management:

```bash
# List credentials
eas credentials

# Create new certificates
eas credentials --platform ios
```

**Required**:
- **Development**: Development Certificate + Provisioning Profile
- **Distribution**: Distribution Certificate + Provisioning Profile

#### Build Types

- **Development**: For testing on registered devices
- **Ad Hoc**: For internal distribution (up to 100 devices)
- **App Store**: For App Store submission

#### TestFlight Distribution

```bash
# Build for TestFlight
eas build --profile production --platform ios

# Submit to TestFlight
eas submit --platform ios
```

### Android Builds

#### Signing Configuration

Android builds require a keystore. EAS can generate and manage this:

```bash
# Create/manage Android credentials
eas credentials --platform android
```

**For production**, you need:
- Upload keystore (for Play Store)
- App signing key certificate (from Google Play Console)

#### Build Types

- **AAB (Android App Bundle)**: Required for Play Store (default)
- **APK**: For direct installation or alternative stores

To build APK instead of AAB, update `eas.json`:

```json
{
  "build": {
    "development": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### Play Store Distribution

```bash
# Build for Play Store
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android
```

## Over-The-Air (OTA) Updates

For JavaScript-only changes, use OTA updates instead of full builds:

```bash
# Bump OTA version
bun bump ota

# Publish update
eas update --branch production --message "Fix login bug"
```

**OTA Update Advantages:**
- ✅ Instant updates (no app store review)
- ✅ No full rebuild required
- ✅ Users get updates on next launch
- ✅ Can rollback quickly

**OTA Update Limitations:**
- ❌ JavaScript/assets only (no native code changes)
- ❌ Requires compatible native build
- ❌ Can't change app permissions
- ❌ Can't update native dependencies

See [Versioning](./VERSIONING.md) for more details on OTA updates.

## Continuous Integration

### GitHub Actions Example

```yaml
name: Build App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: bun install

      - name: Build Android
        run: eas build --profile production --platform android --non-interactive

      - name: Build iOS
        run: eas build --profile production --platform ios --non-interactive
```

## Troubleshooting

### Build Fails

1. **Check build logs** in EAS dashboard or terminal
2. **Clear cache**: `bun start --clear`
3. **Clean native folders**: `bun prebuild --clean`
4. **Verify credentials**: `eas credentials`
5. **Check environment variables**: Ensure all required vars are set

### Android Build Issues

```bash
# Clean gradle cache
cd android
./gradlew clean
cd ..

# Remove and regenerate
rm -rf android
bun prebuild
```

### iOS Build Issues

```bash
# Clean pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Remove and regenerate
rm -rf ios
bun prebuild
```

### Signing Issues

- **iOS**: Check certificates in Apple Developer account
- **Android**: Verify keystore and credentials in EAS
- **Both**: Ensure bundle IDs match in app.config.ts and credentials

## Performance Optimization

### Build Size Optimization

1. **Remove unused dependencies**:
   ```bash
   npx depcheck
   ```

2. **Enable Hermes** (already enabled):
   ```typescript
   // app.config.ts
   ios: {
     jsEngine: 'hermes'
   },
   android: {
     jsEngine: 'hermes'
   }
   ```

3. **Use ProGuard** (Android):
   - Already configured in `android/app/proguard-rules.pro`

4. **Optimize images**:
   - Use WebP format
   - Compress images
   - Use appropriate resolutions

### Build Time Optimization

1. **Use local builds** for development
2. **Cache dependencies** in CI/CD
3. **Incremental builds** when possible
4. **Parallel builds** for multiple platforms

## Next Steps

- Review [Versioning](./VERSIONING.md) for version management
- See [Configuration](./CONFIGURATION.md) for environment setup
- Check [Development](./DEVELOPMENT.md) for development workflow
- Read EAS Build documentation: https://docs.expo.dev/build/introduction/
