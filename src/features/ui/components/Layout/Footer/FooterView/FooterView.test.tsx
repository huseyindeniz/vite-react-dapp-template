import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';

import * as stories from './FooterView.stories';

describe('Feature: UI', () => {
  describe('Component: Layout/Footer/FooterContent', () => {
    const { Default, OnlyFirstRow, OnlySecondRow } = composeStories(stories);
    describe('Scenario: Default', () => {
      it('should be visible and show both rows of content', () => {
        // Arrange
        const { asFragment, getByText } = render(<Default {...Default.args} />);
        // Assert
        expect(getByText(/First row content/)).toBeVisible();
        expect(getByText(/Second row content/)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
    describe('Scenario: Only First Row', () => {
      it('should be visible and show only the first row of content', () => {
        // Arrange
        const { asFragment, getByText } = render(
          <OnlyFirstRow {...OnlyFirstRow.args} />
        );
        // Assert
        expect(getByText(/Only first row content/)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
    describe('Scenario: Only Second Row', () => {
      it('should be visible and show only the second row of content', () => {
        // Arrange
        const { asFragment, getByText } = render(
          <OnlySecondRow {...OnlySecondRow.args} />
        );
        // Assert
        expect(getByText(/Only second row content/)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
