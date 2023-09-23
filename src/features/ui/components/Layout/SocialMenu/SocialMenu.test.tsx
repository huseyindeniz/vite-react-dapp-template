import { composeStories } from '@storybook/react';
import { render, act } from '@testing-library/react';

import * as stories from './SocialMenu.stories';

describe('Feature: UI', () => {
  describe('Component: Layout/SocialMenu', () => {
    const { Default } = composeStories(stories);
    describe('Scenario: Default', () => {
      it('renders a profile button', async () => {
        // Arrange + Act
        const { asFragment, getByRole } = await act(async () =>
          render(<Default {...Default.args} />)
        );
        // Assert
        expect(getByRole('button', { name: 'Twitter' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Discord' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Instagram' })).toBeInTheDocument();
        //expect(getByRole('button', { name: 'Linkedin' })).toBeInTheDocument();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
