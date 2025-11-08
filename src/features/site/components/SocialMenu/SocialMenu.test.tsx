import { composeStories } from '@storybook/react';
import { act, render } from '@test-utils';

import * as stories from './SocialMenu.stories';

describe('Feature: UI', () => {
  describe('Component: Layout/SocialMenu', () => {
    const { Default } = composeStories(stories);
    describe('Scenario: Default', () => {
      it('renders a profile button', async () => {
        // Arrange + Act
        const { asFragment, getByLabelText } = await act(async () =>
          render(<Default {...Default.args} />)
        );
        // Assert
        expect(getByLabelText('GitHub')).toBeInTheDocument();
        expect(getByLabelText('Readme')).toBeInTheDocument();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
