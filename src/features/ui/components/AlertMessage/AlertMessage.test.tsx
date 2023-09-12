import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as stories from './AlertMessage.stories';

describe('Feature: UI', () => {
  describe('Component: AlertMessage', () => {
    const { Error, Info, Warning, Success, Loading } = composeStories(stories);
    describe('Scenario: Error', () => {
      it('should be visible and show error status, title, and children', () => {
        // Arrange
        const { asFragment, getByText, getByRole } = render(
          <Error {...Error.args} />
        );
        // Assert
        expect(getByRole('alert')).toBeVisible();
        expect(getByText(Error.args?.title || '')).toBeVisible();
        expect(getByText(Error.args?.children as string)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
    describe('Scenario: Info', () => {
      it('should be visible and show Info status, title, and children', () => {
        // Arrange
        const { asFragment, getByText } = render(<Info {...Info.args} />);
        // Assert
        expect(getByText(Info.args?.title || '')).toBeVisible();
        expect(getByText(Info.args?.children as string)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
    describe('Scenario: Warning', () => {
      it('should be visible and show Warning status, title, and children', () => {
        // Arrange
        const { asFragment, getByText } = render(<Warning {...Warning.args} />);
        // Assert
        expect(getByText(Warning.args?.title || '')).toBeVisible();
        expect(getByText(Warning.args?.children as string)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
    describe('Scenario: Success', () => {
      it('should be visible and show Success status, title, and children', () => {
        // Arrange
        const { asFragment, getByText } = render(<Success {...Success.args} />);
        // Assert
        expect(getByText(Success.args?.title || '')).toBeVisible();
        expect(getByText(Success.args?.children as string)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
    describe('Scenario: Loading', () => {
      it('should be visible and show Loading status, title, and children', () => {
        // Arrange
        const { asFragment, getByText } = render(<Loading {...Loading.args} />);
        // Assert
        expect(getByText(Loading.args?.title || '')).toBeVisible();
        expect(getByText(Loading.args?.children as string)).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
