import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';

import * as stories from './CheckAccount.stories';

describe('Feature: Wallet', () => {
  describe('Component: ConnectionModal/Steps/CheckAccount', () => {
    const {
      CheckAccountIdle,
      AccountRequested,
      AccountDetectionFailed,
      Locked,
      UnlockRequested,
      UnlockRejected,
      UnlockFailed,
      AccountLoaded,
    } = composeStories(stories);
    const onClickSpy = jest.fn();

    describe('Scenario: CheckAccountIdle, AccountRequested, AccountLoaded', () => {
      it('should be empty', () => {
        // Act
        const result1 = render(<CheckAccountIdle />);
        const result2 = render(<AccountRequested />);
        const result3 = render(<AccountLoaded />);
        // Assert
        expect(result1.container.childElementCount).toEqual(0);
        expect(result2.container.childElementCount).toEqual(0);
        expect(result3.container.childElementCount).toEqual(0);
      });
    });

    describe('Scenario: AccountDetectionFailed', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Unexpected Error';
        const expectedErrorMessage =
          AccountDetectionFailed.args?.errorMessage || '==not_exist==';
        // Act
        const { asFragment, getByText } = render(<AccountDetectionFailed />);
        // Assert
        const actualTitle = getByText(expectedTitle);
        const actualErrorMessage = getByText(
          new RegExp(expectedErrorMessage, 'i')
        );

        expect(actualErrorMessage).toHaveTextContent(expectedErrorMessage);
        expect(actualTitle).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: Locked', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Wallet Is Locked';
        // Act
        const { asFragment, getByText } = render(
          <Locked onUnlock={onClickSpy} />
        );
        getByText('Unlock Wallet').click();
        // Assert
        const actualTitle = getByText(expectedTitle);
        const actualButton = getByText('Unlock Wallet');

        expect(actualTitle).toBeVisible();
        expect(actualButton).toBeVisible();
        expect(onClickSpy).toHaveBeenCalled();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: UnlockRequested', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedMessage =
          'Waiting for the unlock wallet request to be accepted.';
        // Act
        const { asFragment, getByText } = render(<UnlockRequested />);
        // Assert
        const actualMessage = getByText(new RegExp(expectedMessage, 'i'));

        expect(actualMessage).toHaveTextContent(expectedMessage);
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: UnlockRejected', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Unlock Rejected';
        const expectedErrorMessage = 'You rejected the unlock wallet request.';
        // Act
        const { asFragment, getByText } = render(
          <UnlockRejected onUnlock={onClickSpy} />
        );
        getByText('Unlock Wallet').click();
        // Assert
        const actualTitle = getByText(expectedTitle);
        const actualErrorMessage = getByText(
          new RegExp(expectedErrorMessage, 'i')
        );

        expect(actualErrorMessage).toHaveTextContent(expectedErrorMessage);
        expect(actualTitle).toBeVisible();
        expect(onClickSpy).toHaveBeenCalled();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: UnlockFailed', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Unexpected Error';
        const expectedErrorMessage =
          UnlockFailed.args?.errorMessage || '==not_exist==';
        // Act
        const { asFragment, getByText } = render(<UnlockFailed />);
        // Assert
        const actualTitle = getByText(expectedTitle);
        const actualErrorMessage = getByText(
          new RegExp(expectedErrorMessage, 'i')
        );

        expect(actualErrorMessage).toHaveTextContent(expectedErrorMessage);
        expect(actualTitle).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
