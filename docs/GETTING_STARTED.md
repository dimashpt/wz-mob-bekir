# Getting Started

This guide will help you set up the mobile app development environment and run the application locally.

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **Node.js** (v18 or higher)
- **Bun** package manager - [Install Bun](https://bun.sh)
- **Expo CLI** - Will be installed with dependencies
- **iOS Simulator** (for iOS development) - Requires macOS and Xcode
- **Android Studio** (for Android development) - For Android emulator and build tools

### Platform-Specific Requirements

#### iOS Development (macOS only)
- Xcode (latest stable version)
- Xcode Command Line Tools
- CocoaPods (installed via Homebrew or gem)
- iOS Simulator

#### Android Development
- Android Studio (latest stable version)
- Android SDK (API level 31 or higher)
- Android Emulator or physical device
- Java Development Kit (JDK 17)

## Installation

Follow these steps to set up the project:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mobile-app
```

### 2. Install Dependencies

```bash
bun install
```

This will install all required npm packages including:
- React Native and Expo dependencies
- Development tools and libraries
- Testing frameworks
- Code quality tools

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # If example file exists
# Or create manually
```

Add the required environment variables (see [Configuration](./CONFIGURATION.md) for details):

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_SERVICES_JSON=./google-services.json
APP_VARIANT=development
```

### 4. Configure Google Services

Place your `google-services.json` file in the root directory for Android Firebase integration.

## Running the App

### Start the Development Server

```bash
bun start
# or
bun dev
```

This will start the Expo development server. You'll see a QR code and options to open the app on different platforms.

### Run on iOS Simulator

```bash
bun ios
```

This command will:
1. Start the Metro bundler
2. Build the app
3. Launch iOS Simulator
4. Install and run the app

**Note**: iOS development requires macOS with Xcode installed.

### Run on Android Emulator

```bash
bun android
```

This command will:
1. Start the Metro bundler
2. Build the app
3. Launch Android Emulator (or connect to running emulator/device)
4. Install and run the app

**Note**: Ensure you have an Android emulator running or a device connected via ADB.

### Run on Web

```bash
bun web
```

This will open the app in your default web browser. Note that some native features may not be available on web.

## Development Workflow

1. **Start the dev server**: `bun start`
2. **Choose your platform**: Press `i` for iOS, `a` for Android, or `w` for web
3. **Enable Fast Refresh**: Changes will automatically reload in the app
4. **Use Developer Menu**:
   - iOS: Cmd+D in simulator or shake device
   - Android: Cmd+M (Mac) or Ctrl+M (Windows/Linux) or shake device

## Troubleshooting

### Common Issues

#### Metro Bundler Cache Issues
```bash
# Clear Metro bundler cache
bun start --clear

# Or clear all caches
rm -rf node_modules
rm -rf .expo
bun install
```

#### iOS Build Issues
```bash
# Clear iOS build cache
cd ios
rm -rf build
rm -rf Pods
pod install
cd ..
```

#### Android Build Issues
```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..

# Rebuild app
bun android
```

#### Port Already in Use
```bash
# Kill process on port 8081 (Metro bundler)
lsof -ti:8081 | xargs kill -9
```

### Getting Help

- Check the [Development Guide](./DEVELOPMENT.md) for more detailed information
- Review the [Expo documentation](https://docs.expo.dev/)
- Check [React Native documentation](https://reactnative.dev/)
- Contact the development team

## Next Steps

- Read the [Project Structure](./PROJECT_STRUCTURE.md) documentation
- Learn about [Development Practices](./DEVELOPMENT.md)
- Explore [Configuration Options](./CONFIGURATION.md)
- Review [Building for Production](./BUILDING.md)
