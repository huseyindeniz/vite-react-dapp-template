import { composeStories } from '@storybook/react';
import { render } from '@test-utils';

import * as stories from './PageLoading.stories';

describe('Feature: UI', () => {
  describe('Component: Layout/PageLoading', () => {
    const { Default } = composeStories(stories);
    describe('Scenario: Error', () => {
      it('should render correctly', () => {
        // Arrange
        const { asFragment } = render(<Default {...Default.args} />);
        // Assert
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
