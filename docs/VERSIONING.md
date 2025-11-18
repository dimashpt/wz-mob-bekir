# Versioning

This document covers version management and release process for the mobile app.

## bump-version.js

A comprehensive script to manage version bumps for the Expo app, supporting both **Store Updates** (full native builds) and **OTA Updates** (Over-The-Air updates without native rebuilds).

### Usage

```bash
bun bump <version-type> [flags]
```

### Version Types

#### Store Update (Full Native Build)
These version types will trigger a full store update with native code changes:

- **patch**: `1.0.0` → `1.0.1` (bug fixes)
- **minor**: `1.0.0` → `1.1.0` (new features)
- **major**: `1.0.0` → `2.0.0` (breaking changes)
- **prepatch**: `1.0.0` → `1.0.1-0` (pre-release patch)
- **preminor**: `1.0.0` → `1.1.0-0` (pre-release minor)
- **premajor**: `1.0.0` → `2.0.0-0` (pre-release major)
- **prerelease**: `1.0.0-0` → `1.0.0-1` (increment pre-release)
- **Specific version**: e.g., `2.1.0-beta.1`

#### OTA Update (Over-The-Air)
For JavaScript-only updates that don't require native code changes:

- **ota**: Adds or increments OTA suffix
  - `2.3.0` → `2.3.0-ota.1` (first OTA update)
  - `2.3.0-ota.1` → `2.3.0-ota.2` (subsequent OTA updates)

### Flags

- `--skip-build-number`: Skip incrementing iOS buildNumber and Android versionCode (version name only)
- `--build-number-only`: Only increment build numbers without version bump or tag creation

### What it does

#### Store Update Process
1. **Bumps version** in `package.json` using `npm version`
2. **Updates app config** in `app.config.ts` (VERSION constant and BUILD_NUMBER)
3. **Generates changelog** automatically from conventional commit messages since last tag
4. **Commits changes** automatically with commit message `v{version}` (e.g., `v1.0.0`)
5. **Creates git tag** automatically with tag name `v{version}`
6. **Runs expo prebuild** to update native code (Android & iOS)
7. **Pushes changes and tag** to remote repository automatically
8. **Opens GitHub release page** with pre-filled title and changelog

#### OTA Update Process
1. **Updates version** in `package.json` only (adds/increments `-ota.X` suffix)
2. **Generates changelog** from conventional commits
3. **Commits changes** with `v{version}` message
4. **Creates git tag** `v{version}`
5. **Pushes changes and tag** to remote
6. **Opens GitHub release page** with pre-filled information
7. **Skips expo prebuild** (no native code changes)

#### Build Number Only
1. **Increments BUILD_NUMBER** constant in `app.config.ts`
2. **Commits the change** with descriptive message
3. **No version bump, no tag, no prebuild**

### Changelog Generation

The script automatically generates a `CHANGELOG.md` file based on conventional commit messages:

- **✨ Features** (`feat:`) - New features
- **🐛 Bug Fixes** (`fix:`) - Bug fixes
- **♻️ Code Refactoring** (`refactor:`) - Code refactoring
- **💄 Styles** (`style:`) - Styling changes
- **📚 Documentation** (`docs:`) - Documentation updates
- **🔧 Chores** (`chore:`) - Maintenance tasks
- And more...

The changelog includes:
- Commit hash links for easy reference
- Scoped commits (e.g., `feat(auth): add login`)
- Breaking change indicators (`!`)

### Examples

#### Store Updates (Full Native Build)
```bash
# Bump patch version (1.0.0 -> 1.0.1)
bun bump patch

# Bump minor version (1.0.0 -> 1.1.0)
bun bump minor

# Bump major version (1.0.0 -> 2.0.0)
bun bump major

# Set specific version
bun bump 2.1.0-beta.1

# Bump version but skip build number increment
bun bump patch --skip-build-number
```

#### OTA Updates (Over-The-Air)
```bash
# Create or increment OTA version
# 2.3.0 -> 2.3.0-ota.1
# 2.3.0-ota.1 -> 2.3.0-ota.2
bun bump ota
```

#### Build Number Only
```bash
# Only increment build numbers (no version bump, no tag)
bun bump --build-number-only
```

### Automated Workflow

The script handles the complete release workflow automatically:

#### For Store Updates:
```bash
bun bump patch
# ✅ Bumps version in package.json and app.config.ts
# ✅ Increments BUILD_NUMBER for native builds
# ✅ Generates changelog from conventional commits
# ✅ Commits with "v1.0.1"
# ✅ Creates tag "v1.0.1"
# ✅ Runs expo prebuild (updates native code)
# ✅ Pushes changes and tag to remote
# ✅ Opens GitHub release page
```

#### For OTA Updates:
```bash
bun bump ota
# ✅ Increments OTA version in package.json only
# ✅ Generates changelog from conventional commits
# ✅ Commits with "v2.3.0-ota.1"
# ✅ Creates tag "v2.3.0-ota.1"
# ✅ Pushes changes and tag to remote
# ✅ Opens GitHub release page
# ⏭️  Skips expo prebuild (no native changes)
```

### Build Number Management

The script uses a `BUILD_NUMBER` constant in `app.config.ts` that is shared between iOS and Android:
- iOS `buildNumber` uses this constant
- Android `versionCode` uses this constant

This ensures build numbers stay synchronized across platforms.

## reset-project.js

Resets the project by removing node_modules and reinstalling dependencies.
