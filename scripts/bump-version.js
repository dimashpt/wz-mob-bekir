#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VALID_VERSION_TYPES = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

const CHANGELOG_CONFIG = {
  types: {
    feat: { title: '✨ Features', order: 1 },
    fix: { title: '🐛 Bug Fixes', order: 2 },
    perf: { title: '⚡ Performance Improvements', order: 3 },
    refactor: { title: '♻️ Code Refactoring', order: 4 },
    style: { title: '💄 Styles', order: 5 },
    docs: { title: '📚 Documentation', order: 6 },
    test: { title: '✅ Tests', order: 7 },
    build: { title: '📦 Build System', order: 8 },
    ci: { title: '👷 CI/CD', order: 9 },
    chore: { title: '🔧 Chores', order: 10 },
    revert: { title: '⏪ Reverts', order: 11 },
  },
};

function showUsage() {
  console.log('Usage: node scripts/bump-version.js <version-type> [flags]');
  console.log('');
  console.log('Version types (Store Update):');
  console.log('  patch       1.0.0 -> 1.0.1');
  console.log('  minor       1.0.0 -> 1.1.0');
  console.log('  major       1.0.0 -> 2.0.0');
  console.log('  prepatch    1.0.0 -> 1.0.1-0');
  console.log('  preminor    1.0.0 -> 1.1.0-0');
  console.log('  premajor    1.0.0 -> 2.0.0-0');
  console.log('  prerelease  1.0.0-0 -> 1.0.0-1');
  console.log('  <version>   Specific version (e.g., 2.1.0-beta.1)');
  console.log('');
  console.log('Version types (OTA - Over the Air):');
  console.log(
    '  ota         2.3.0 -> 2.3.0-ota.1, 2.3.0-ota.1 -> 2.3.0-ota.2, etc.',
  );
  console.log('');
  console.log('Flags:');
  console.log(
    '  --skip-build-number   Skip incrementing iOS buildNumber and Android versionCode',
  );
  console.log(
    '  --build-number-only   Only increment build numbers without version bump or tag creation',
  );
  console.log('');
  console.log('Store Update does:');
  console.log('  1. Bumps version in package.json and app.config.ts');
  console.log('  2. Generates changelog from conventional commits');
  console.log('  3. Commits changes and creates a git tag');
  console.log('  4. Runs expo prebuild');
  console.log('  5. Pushes changes and tag to remote repository');
  console.log('  6. Opens GitHub release page with pre-filled information');
  console.log('');
  console.log('OTA Update does:');
  console.log(
    '  1. Updates version in package.json only (adds/increments OTA suffix)',
  );
  console.log('  2. Generates changelog from conventional commits');
  console.log('  3. Commits changes and creates a git tag');
  console.log('  4. Pushes changes and tag to remote repository');
  console.log('  5. Opens GitHub release page with pre-filled information');
  console.log('');
  console.log('Examples (Store Update):');
  console.log('  bun bump patch');
  console.log('  bun bump minor');
  console.log('  bun bump 2.1.0-beta.1');
  console.log('  bun bump patch --skip-build-number');
  console.log('  bun bump --build-number-only');
  console.log('');
  console.log('Examples (OTA Update):');
  console.log('  bun bump ota');
}

function parseArguments() {
  const args = process.argv.slice(2);
  const versionType = args.find((arg) => !arg.startsWith('--'));
  const skipBuildNumber = args.includes('--skip-build-number');
  const buildNumberOnly = args.includes('--build-number-only');
  const isOta = versionType === 'ota';

  return { versionType, skipBuildNumber, buildNumberOnly, isOta };
}

function validateVersionType(versionType, buildNumberOnly, isOta) {
  if (!versionType && !buildNumberOnly) {
    console.error(
      '❌ Error: Version type is required (unless using --build-number-only)',
    );
    showUsage();
    process.exit(1);
  }

  // Skip validation if only incrementing build number or doing OTA
  if (buildNumberOnly || isOta) {
    return;
  }

  // Check if it's a valid npm version type or a specific version
  if (
    !VALID_VERSION_TYPES.includes(versionType) &&
    !/^\d+\.\d+\.\d+/.test(versionType)
  ) {
    console.error(`❌ Error: Invalid version type "${versionType}"`);
    showUsage();
    process.exit(1);
  }
}

function runNpmVersion(versionType) {
  try {
    console.log(`🚀 Running npm version ${versionType}...`);
    execSync(`npm version ${versionType} --no-git-tag-version`, {
      stdio: 'inherit',
    });
    return true; // Success
  } catch (error) {
    // Check if the error is due to version already existing
    const errorMessage = error.message.toLowerCase();
    if (
      errorMessage.includes('version not changed') ||
      errorMessage.includes('already exists') ||
      errorMessage.includes('version is the same') ||
      errorMessage.includes('command failed: npm version')
    ) {
      console.log(
        `⚠️  Version ${versionType} already exists, continuing with build number increment...`,
      );
      return false; // Version already exists, but continue
    }
    console.error('❌ Error running npm version:', error.message);
    process.exit(1);
  }
}

function getNewVersion() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    process.exit(1);
  }
}

function getTargetVersion(versionType) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;

    // If it's a specific version, return it directly
    if (/^\d+\.\d+\.\d+/.test(versionType)) {
      return versionType;
    }

    // For version types like patch, minor, major, use npm to calculate the target version
    try {
      const result = execSync(`npm version ${versionType} --dry-run --json`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      const versionInfo = JSON.parse(result);
      return versionInfo.newVersion;
    } catch {
      // Fallback: manually calculate version
      const [major, minor, patch] = currentVersion.split('.').map(Number);

      switch (versionType) {
        case 'patch':
          return `${major}.${minor}.${patch + 1}`;
        case 'minor':
          return `${major}.${minor + 1}.0`;
        case 'major':
          return `${major + 1}.0.0`;
        default:
          return currentVersion;
      }
    }
  } catch (error) {
    console.error('❌ Error calculating target version:', error.message);
    process.exit(1);
  }
}

function updateBuildNumberOnly() {
  try {
    const appConfigPath = path.join(process.cwd(), 'app.config.ts');
    let content = fs.readFileSync(appConfigPath, 'utf8');

    let newBuildNumber = null;

    // Get current BUILD_NUMBER constant
    const buildNumberMatch = content.match(/const BUILD_NUMBER = (\d+);/);

    if (buildNumberMatch) {
      const currentBuildNumber = parseInt(buildNumberMatch[1]);
      newBuildNumber = currentBuildNumber + 1;
      content = content.replace(
        /const BUILD_NUMBER = \d+;/,
        `const BUILD_NUMBER = ${newBuildNumber};`,
      );
      console.log(
        `📱 Updated BUILD_NUMBER: ${currentBuildNumber} -> ${newBuildNumber}`,
      );
      console.log(
        `🤖 Android versionCode and iOS buildNumber will use updated BUILD_NUMBER constant`,
      );
    }

    fs.writeFileSync(appConfigPath, content);
    console.log('✅ Updated app.config.ts build numbers');

    return newBuildNumber;
  } catch (error) {
    console.error('❌ Error updating app.config.ts:', error.message);
    process.exit(1);
  }
}

function getBaseVersion(version) {
  // Extract base version without OTA suffix
  // e.g., "2.3.0-1" -> "2.3.0", "2.3.0" -> "2.3.0"
  return version.split('-').slice(0, 1).join('-');
}

function getOtaSuffix(version) {
  // Extract OTA suffix number
  // e.g., "2.3.0-ota.1" -> "1", "2.3.0" -> null
  if (!version.includes('-ota.')) {
    return null;
  }
  const match = version.match(/-ota\.(\d+)$/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}

function calculateOtaVersion(currentVersion) {
  // Handle OTA version increment
  // e.g., "2.3.0" -> "2.3.0-ota.1", "2.3.0-ota.1" -> "2.3.0-ota.2"
  const baseVersion = getBaseVersion(currentVersion);
  const currentSuffix = getOtaSuffix(currentVersion);

  if (currentSuffix === null) {
    // First OTA update for this base version
    return `${baseVersion}-ota.1`;
  }

  // Increment existing OTA suffix
  return `${baseVersion}-ota.${currentSuffix + 1}`;
}

function updatePackageJsonVersion(newVersion) {
  // Only update package.json without using npm version command
  // This allows us to set versions with custom OTA suffixes
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
    );
    console.log(`✅ Updated package.json version: ${newVersion}`);
    return true;
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
    process.exit(1);
  }
}

function updateAppConfig(newVersion, skipBuildNumber = false) {
  try {
    const appConfigPath = path.join(process.cwd(), 'app.config.ts');
    let content = fs.readFileSync(appConfigPath, 'utf8');

    // Update VERSION constant
    content = content.replace(
      /const VERSION = ['"`][^'"`]*['"`];/,
      `const VERSION = '${newVersion}';`,
    );

    if (!skipBuildNumber) {
      // Get current BUILD_NUMBER constant
      const buildNumberMatch = content.match(/const BUILD_NUMBER = (\d+);/);
      const versionCodeMatch = content.match(/versionCode:\s*BUILD_NUMBER/);

      if (buildNumberMatch) {
        const currentBuildNumber = parseInt(buildNumberMatch[1]);
        const newBuildNumber = currentBuildNumber + 1;
        content = content.replace(
          /const BUILD_NUMBER = \d+;/,
          `const BUILD_NUMBER = ${newBuildNumber};`,
        );
        console.log(
          `📱 Updated BUILD_NUMBER: ${currentBuildNumber} -> ${newBuildNumber}`,
        );
      }

      // Note: versionCode uses BUILD_NUMBER constant, so no separate update needed
      if (versionCodeMatch) {
        console.log(
          `🤖 Android versionCode will use updated BUILD_NUMBER constant`,
        );
      }
    } else {
      console.log(
        '⏭️  Skipping build number increment (--skip-build-number flag)',
      );
    }

    fs.writeFileSync(appConfigPath, content);
    console.log(`✅ Updated app.config.ts version: ${newVersion}`);
  } catch (error) {
    console.error('❌ Error updating app.config.ts:', error.message);
    process.exit(1);
  }
}

function getLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    }).trim();
    return lastTag;
  } catch {
    console.log(
      'ℹ️  No previous tags found, generating changelog from all commits',
    );
    return null;
  }
}

function getCommitsSinceTag(tag) {
  try {
    const range = tag ? `${tag}..HEAD` : 'HEAD';
    const commits = execSync(`git log --pretty=format:"%h|%s" ${range}`, {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const [hash, subject] = line.split('|');
        return { hash, subject: subject || '' };
      });

    return commits;
  } catch (error) {
    console.error('❌ Error getting commits:', error.message);
    return [];
  }
}

function parseConventionalCommit(subject) {
  const conventionalPattern = /^(\w+)(\(.+\))?!?:\s(.+)$/;
  const match = subject.match(conventionalPattern);

  if (match) {
    const [, type, scope, description] = match;
    return {
      type: type.toLowerCase(),
      scope: scope ? scope.slice(1, -1) : null, // Remove parentheses
      description,
      isBreaking: subject.includes('!'),
    };
  }

  // If not conventional, categorize as 'other'
  return {
    type: 'other',
    scope: null,
    description: subject,
    isBreaking: false,
  };
}

function groupCommitsByType(commits) {
  const grouped = {};

  commits.forEach((commit) => {
    const parsed = parseConventionalCommit(commit.subject);
    const type = parsed.type;

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push({
      ...commit,
      ...parsed,
    });
  });

  return grouped;
}

function generateChangelog(version, groupedCommits) {
  const date = new Date().toISOString().split('T')[0];
  let changelogContent = `## [${version}] - ${date}\n\n`;

  // Sort types by order
  const sortedTypes = Object.keys(groupedCommits).sort((a, b) => {
    const orderA = CHANGELOG_CONFIG.types[a]?.order || 999;
    const orderB = CHANGELOG_CONFIG.types[b]?.order || 999;
    return orderA - orderB;
  });

  sortedTypes.forEach((type) => {
    const commits = groupedCommits[type];
    const typeConfig = CHANGELOG_CONFIG.types[type];

    if (commits.length === 0) return;

    const title = typeConfig
      ? typeConfig.title
      : `🔗 ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    changelogContent += `### ${title}\n\n`;

    commits.forEach((commit) => {
      const scope = commit.scope ? `**${commit.scope}**: ` : '';
      const breaking = commit.isBreaking ? ' ⚠️ BREAKING' : '';
      changelogContent += `- ${scope}${commit.description}${breaking} ([${commit.hash}](../../commit/${commit.hash}))\n`;
    });

    changelogContent += '\n';
  });

  return changelogContent;
}

function commitChanges(version) {
  try {
    console.log('\n📝 Committing changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "v${version}"`, { stdio: 'inherit' });
    console.log(`✅ Committed changes with message "v${version}"`);
  } catch (error) {
    console.error('❌ Error committing changes:', error.message);
    process.exit(1);
  }
}

function createTag(version) {
  try {
    console.log('\n🏷️  Creating tag...');
    const tagName = `v${version}`;

    // Check if tag already exists
    try {
      execSync(`git rev-parse --verify ${tagName}`, { stdio: 'pipe' });
      console.log(
        `⚠️  Tag "${tagName}" already exists, skipping tag creation...`,
      );
      return;
    } catch {
      // Tag doesn't exist, proceed with creation
    }

    execSync(`git tag ${tagName}`, { stdio: 'inherit' });
    console.log(`✅ Created tag "${tagName}"`);
  } catch (error) {
    console.error('❌ Error creating tag:', error.message);
    process.exit(1);
  }
}

function runExpoPrebuild() {
  try {
    console.log('\n🔨 Running expo prebuild...');
    execSync('npx expo prebuild', {
      stdio: 'inherit',
    });
    console.log('✅ Expo prebuild completed successfully');
  } catch (error) {
    console.error('❌ Error running expo prebuild:', error.message);
    console.log('⚠️  Continuing with version bump process...');
  }
}

function getGitHubRepoUrl() {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', {
      encoding: 'utf8',
    }).trim();

    // Convert SSH URL to HTTPS if needed
    if (remoteUrl.startsWith('git@github.com:')) {
      return remoteUrl
        .replace('git@github.com:', 'https://github.com/')
        .replace('.git', '');
    }

    // Remove .git suffix if present
    return remoteUrl.replace('.git', '');
  } catch (error) {
    console.error('❌ Error getting GitHub repository URL:', error.message);
    return null;
  }
}

function pushTagToRemote(version) {
  try {
    console.log('\n🚀 Pushing changes and tag to remote...');
    const tagName = `v${version}`;

    // Push commits first
    execSync('git push', { stdio: 'inherit' });
    console.log('✅ Pushed commits to remote');

    // Push the tag
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
    console.log(`✅ Pushed tag "${tagName}" to remote`);
  } catch (error) {
    console.error('❌ Error pushing to remote:', error.message);
    console.log(
      '⚠️  You may need to push manually: git push && git push --tags',
    );
  }
}

function openGitHubReleasePage(version, changelogContent) {
  try {
    const repoUrl = getGitHubRepoUrl();
    if (!repoUrl) {
      console.log('⚠️  Could not determine GitHub repository URL');
      return;
    }

    const tagName = `v${version}`;

    // Clean up changelog content for URL encoding
    // Remove markdown headers and format for GitHub release
    const releaseBody = changelogContent
      .replace(/^## \[.*?\] - .*?\n\n/, '') // Remove version header
      .replace(/### /g, '**') // Convert h3 to bold
      .replace(/\n\n/g, '**\n\n') // Close bold tags
      .trim();

    // URL encode the content
    const encodedTitle = encodeURIComponent(tagName);
    const encodedBody = encodeURIComponent(releaseBody);

    // Construct GitHub release URL with pre-filled data
    const releaseUrl = `${repoUrl}/releases/new?tag=${encodedTitle}&title=${encodedTitle}&body=${encodedBody}`;

    console.log('\n🌐 Opening GitHub release page...');
    console.log(`📝 Release title: ${tagName}`);
    console.log('📋 Release description: Pre-filled with generated changelog');

    // Open the URL in the default browser
    const open = require('child_process').spawn;
    const command =
      process.platform === 'darwin'
        ? 'open'
        : process.platform === 'win32'
          ? 'start'
          : 'xdg-open';

    if (process.platform === 'win32') {
      open('cmd', ['/c', 'start', releaseUrl], { stdio: 'ignore' });
    } else {
      open(command, [releaseUrl], { stdio: 'ignore' });
    }

    console.log('✅ GitHub release page opened in your default browser');
    console.log(`🔗 URL: ${repoUrl}/releases/new`);
  } catch (error) {
    console.error('❌ Error opening GitHub release page:', error.message);
    console.log(
      '💡 You can manually create a release at: https://github.com/your-repo/releases/new',
    );
  }
}

function updateChangelog(version, changelogContent) {
  const changelogPath = path.join(process.cwd(), 'docs', 'CHANGELOG.md');

  try {
    let existingContent = '';
    if (fs.existsSync(changelogPath)) {
      existingContent = fs.readFileSync(changelogPath, 'utf8');
    } else {
      existingContent =
        '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }

    // Insert new changelog content after the header
    const lines = existingContent.split('\n');
    const headerEndIndex = lines.findIndex((line) => line.startsWith('## '));

    if (headerEndIndex === -1) {
      // No existing versions, add after header
      const newContent =
        lines.slice(0, 3).join('\n') + '\n' + changelogContent + '\n';
      fs.writeFileSync(changelogPath, newContent);
    } else {
      // Insert before first version
      const newLines = [
        ...lines.slice(0, headerEndIndex),
        changelogContent.trim(),
        '',
        ...lines.slice(headerEndIndex),
      ];
      fs.writeFileSync(changelogPath, newLines.join('\n'));
    }

    console.log('📝 Updated CHANGELOG.md');
  } catch (error) {
    console.error('❌ Error updating changelog:', error.message);
  }
}

function main() {
  const { versionType, skipBuildNumber, buildNumberOnly, isOta } =
    parseArguments();

  if (buildNumberOnly) {
    console.log('🔄 Incrementing build numbers only...\n');
    const newBuildNumber = updateBuildNumberOnly();

    // Commit changes
    try {
      console.log('\n📝 Committing build number changes...');
      execSync('git add .', {
        stdio: 'inherit',
      });
      const commitMessage = newBuildNumber
        ? `build: increment build numbers to ${newBuildNumber}`
        : 'build: increment build numbers';
      execSync(`git commit -m "${commitMessage}"`, {
        stdio: 'inherit',
      });
      console.log(`✅ Committed build number changes`);
    } catch (error) {
      console.error('❌ Error committing changes:', error.message);
      process.exit(1);
    }

    console.log('\n✨ Build number increment completed successfully!');
    return;
  }

  if (isOta) {
    console.log('🔄 Bumping OTA version (Over the Air update)...\n');

    const currentVersion = getNewVersion();
    const newVersion = calculateOtaVersion(currentVersion);
    console.log(`📦 New OTA version: ${currentVersion} -> ${newVersion}`);

    updatePackageJsonVersion(newVersion);

    // Generate changelog
    console.log('\n📚 Generating changelog...');
    const lastTag = getLastTag();
    const commits = getCommitsSinceTag(lastTag);

    let changelogContent = '';
    if (commits.length > 0) {
      const groupedCommits = groupCommitsByType(commits);
      changelogContent = generateChangelog(newVersion, groupedCommits);
      updateChangelog(newVersion, changelogContent);
      console.log(
        `✅ Generated changelog entry for ${commits.length} commits since ${lastTag || 'first commit'}`,
      );
    } else {
      console.log(
        'ℹ️  No new commits since last tag, skipping changelog generation',
      );
      changelogContent = `## [${newVersion}] - ${new Date().toISOString().split('T')[0]}\n\nOTA Update - No new commits`;
    }

    // Commit changes
    commitChanges(newVersion);

    // Create tag
    createTag(newVersion);

    // Push tag to remote (skip expo prebuild for OTA)
    pushTagToRemote(newVersion);

    // Open GitHub release page with pre-filled data
    openGitHubReleasePage(newVersion, changelogContent);

    console.log('\n✨ OTA version bump completed successfully!');
    return;
  }

  console.log('🔄 Bumping Expo app version...\n');

  validateVersionType(versionType, buildNumberOnly, isOta);
  const versionBumpSuccess = runNpmVersion(versionType);

  let newVersion;
  if (versionBumpSuccess) {
    newVersion = getNewVersion();
    console.log(`📦 New package.json version: ${newVersion}`);
  } else {
    // Version already exists, get the target version for app.config.ts update
    newVersion = getTargetVersion(versionType);
    console.log(`📦 Using existing version: ${newVersion}`);
  }

  updateAppConfig(newVersion, skipBuildNumber);

  // Generate changelog
  console.log('\n📚 Generating changelog...');
  const lastTag = getLastTag();
  const commits = getCommitsSinceTag(lastTag);

  let changelogContent = '';
  if (commits.length > 0) {
    const groupedCommits = groupCommitsByType(commits);
    changelogContent = generateChangelog(newVersion, groupedCommits);
    updateChangelog(newVersion, changelogContent);
    console.log(
      `✅ Generated changelog entry for ${commits.length} commits since ${lastTag || 'first commit'}`,
    );
  } else {
    console.log(
      'ℹ️  No new commits since last tag, skipping changelog generation',
    );
    changelogContent = `## [${newVersion}] - ${new Date().toISOString().split('T')[0]}\n\nNo new commits since last tag.`;
  }

  // Commit changes
  commitChanges(newVersion);

  // Create tag
  createTag(newVersion);

  // Run expo prebuild
  runExpoPrebuild();

  // Push tag to remote
  pushTagToRemote(newVersion);

  // Open GitHub release page with pre-filled data
  openGitHubReleasePage(newVersion, changelogContent);

  console.log('\n✨ Version bump completed successfully!');
}

if (require.main === module) {
  main();
}

module.exports = { main };
