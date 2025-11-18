# Contributing

Thank you for your interest in contributing to the mobile app! This guide will help you understand our development process and contribution guidelines.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development Environment Set Up**
   - Follow the [Getting Started](./GETTING_STARTED.md) guide
   - Ensure all prerequisites are installed
   - Verify you can run the app locally

2. **Access to Repository**
   - Request access from the project maintainers
   - Set up SSH keys for GitHub

3. **Understanding of the Codebase**
   - Review [Project Structure](./PROJECT_STRUCTURE.md)
   - Read through [Development Guide](./DEVELOPMENT.md)
   - Familiarize yourself with key technologies

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your local main/develop branch
git checkout develop
git pull origin develop

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/doc-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow these guidelines while making changes:

#### Code Organization
- Place files in the appropriate directories (see [Project Structure](./PROJECT_STRUCTURE.md))
- Keep components small and focused
- Separate business logic from UI components
- Use TypeScript for type safety

#### Code Quality
- Follow existing code patterns
- Write clean, self-documenting code
- Add comments for complex logic
- Keep functions small and single-purpose
- Avoid code duplication

#### Internationalization
- Add all user-facing text to locale files
- Support both English (`en`) and Indonesian (`id`)
- Use descriptive translation keys

```typescript
// ✅ Good
const { t } = useTranslation();
<Text>{t('attendance.checkIn')}</Text>

// ❌ Bad
<Text>Check In</Text>
```

### 3. Write Tests

All new features and bug fixes should include tests:

```bash
# Run tests as you develop
bun test

# Ensure tests pass
bun test:ci

# Check coverage
bun test --coverage
```

See [Testing Guide](./TESTING.md) for detailed testing guidelines.

### 4. Lint and Format

Ensure your code meets quality standards:

```bash
# Run linter
bun lint

# Fix auto-fixable issues
bun lint --fix

# Type check
bun tsc
```

### 5. Commit Your Changes

Follow our commit message convention (see [Commit Guidelines](#commit-guidelines)):

```bash
git add .
git commit -m "feat(attendance): add face recognition feature"
```

### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and automated changelog generation.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI/CD configuration
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scopes

Use the feature or module name as the scope:

- `attendance`
- `leave`
- `overtime`
- `approval`
- `auth`
- `profile`
- `notification`
- `api`
- `ui`
- etc.

### Examples

```bash
# Feature with scope
git commit -m "feat(attendance): add face recognition for check-in"

# Bug fix
git commit -m "fix(login): resolve token expiration issue"

# Documentation
git commit -m "docs: update API integration guide"

# Breaking change
git commit -m "feat(api)!: change authentication flow

BREAKING CHANGE: API endpoints now require Bearer token"

# Multiple paragraphs
git commit -m "feat(leave): add annual leave balance tracking

- Add balance calculation
- Display remaining days
- Show usage history

Closes #123"
```

### Commit Message Guidelines

**DO:**
- ✅ Use present tense ("add feature" not "added feature")
- ✅ Use imperative mood ("move cursor to..." not "moves cursor to...")
- ✅ Keep subject line under 72 characters
- ✅ Capitalize first letter of subject
- ✅ Don't end subject line with a period
- ✅ Separate subject from body with blank line
- ✅ Reference issues and PRs in the footer

**DON'T:**
- ❌ Use vague messages like "fix bug" or "update code"
- ❌ Combine multiple unrelated changes
- ❌ Write overly long subject lines
- ❌ Include unnecessary details

## Pull Request Process

### Before Creating a PR

1. **Ensure all tests pass**
   ```bash
   bun test:ci
   ```

2. **Lint your code**
   ```bash
   bun lint
   ```

3. **Update documentation** if needed

4. **Rebase on latest develop**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

### Creating a Pull Request

1. **Use a descriptive title**
   - Follow the same format as commit messages
   - Example: `feat(attendance): add face recognition`

2. **Fill out the PR template**
   - Description of changes
   - Related issues
   - Type of change
   - Testing done
   - Screenshots (for UI changes)

3. **Request reviewers**
   - Tag relevant team members
   - Assign to project lead if needed

### PR Template Example

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Closes #123
Related to #456

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings generated
```

### Review Process

1. **Address review comments promptly**
2. **Make requested changes in new commits**
3. **Respond to all comments** (even if just "Done")
4. **Request re-review** after making changes
5. **Squash commits** if requested before merge

### After PR is Approved

1. **Squash and merge** (usually preferred)
2. **Delete the feature branch**
3. **Close related issues**

## Code Style

### TypeScript

- Use explicit types for function parameters and returns
- Avoid `any` type
- Use interfaces for object shapes
- Use type for unions and primitives
- Enable strict mode

### React/React Native

- Use functional components
- Use hooks instead of class components
- Use `useMemo`, `useCallback`, `React.memo` appropriately for performance optimization
- Keep components small and focused
- Extract reusable logic to custom hooks

### Naming Conventions

- **Components**: PascalCase (`AttendanceCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAttendance.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase (`User`, `AttendanceRecord`)

### File Organization

- One component per file
- Group related files in folders
- Index files for public exports
- Keep files under 300 lines when possible

## Testing Requirements

### Required Tests

- **New Features**: Must include tests
- **Bug Fixes**: Must include regression test
- **Refactoring**: Maintain existing test coverage

### Coverage Requirements

- Maintain or improve code coverage
- Target: 80% overall coverage
- Critical paths: 100% coverage

### Test Guidelines

- Test user behavior, not implementation
- Use descriptive test names
- Keep tests simple and focused
- Mock external dependencies
- Clean up after tests

See [Testing Guide](./TESTING.md) for detailed information.

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Modify configuration
- Update dependencies
- Change development workflow

### Documentation Files to Update

- **README.md**: Overview and quick start
- **DEVELOPMENT.md**: Development practices
- **CONFIGURATION.md**: Config changes
- **API.md**: API changes (if exists)
- **CHANGELOG.md**: Via version bump script
- **Code comments**: Complex logic

### Writing Good Documentation

- Be clear and concise
- Include code examples
- Keep it up to date
- Use proper formatting
- Add screenshots for UI features

## Communication

### Channels

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code review and discussion
- **Team Chat**: Quick questions and discussions
- **Email**: Official communications

### Asking for Help

- Check documentation first
- Search existing issues
- Provide context and details
- Include error messages and logs
- Share relevant code snippets

## Code of Conduct

### Our Standards

- Be respectful and professional
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

## Recognition

Contributors will be:

- Listed in the project contributors
- Mentioned in release notes for significant contributions
- Credited in documentation updates

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search GitHub issues
3. Ask on team communication channels
4. Contact project maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

**Thank you for contributing to the mobile app! 🎉**
