import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';

import * as stories from './ThemeSwitcher.stories';

describe('Feature: UI', () => {
  describe('Component: Layout/ThemeSwitcher', () => {
    const { Default } = composeStories(stories);
    describe('Scenario: Default', () => {
      it('renders a ThemeSwitch button', () => {
        // Arrange
        const { asFragment, getByRole } = render(<Default {...Default.args} />);
        // Assert
        expect(
          getByRole('button', { name: 'Toggle Color Mode' })
        ).toBeInTheDocument();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
