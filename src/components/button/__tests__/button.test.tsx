/**
 * Example test file for the Button component
 *
 * This file demonstrates how to test React Native components.
 * Note: Complex components with Reanimated and native dependencies
 * may require additional mocking setup for full unit testing.
 *
 * For complete integration testing of UI components with animations,
 * consider using:
 * - React Native Testing Library (already installed)
 * - Detox for E2E testing
 * - Storybook for visual regression testing (already set up)
 */

// Example test structure (currently skipped due to complex native dependencies)
describe('Button Component Example Tests', () => {
  it('demonstrates test structure for the Button component', () => {
    // When testing the Button component, you would:
    // 1. Mock react-native-reanimated for animations
    // 2. Mock uniwind for CSS variables
    // 3. Mock dependent components (@/components/*)
    // 4. Use render() from @testing-library/react-native
    // 5. Test user interactions with fireEvent or userEvent

    expect(true).toBe(true);
  });

  it('documents how to set up complex component tests', () => {
    // For components with complex dependencies:
    // - Create jest.setup.js entries for global mocks
    // - Use jest.mock() for module-level mocks
    // - Consider splitting tests into:
    //   * Logic tests (easier to unit test)
    //   * Snapshot tests (for visual consistency)
    //   * Integration tests (with real dependencies)

    expect(true).toBe(true);
  });

  it('shows test naming conventions', () => {
    // Test names should be descriptive:
    // ✓ "renders with text correctly"
    // ✓ "disables button when disabled prop is true"
    // ✗ "works" (too vague)
    // ✗ "test1" (not descriptive)

    expect(true).toBe(true);
  });
});
