import { composeStories } from '@storybook/react';
import { render } from '@test-utils';

import * as stories from './CheckSign.stories';

describe('Feature: Wallet', () => {
  describe('Component: ConnectionModal/Steps/CheckSign', () => {
    const {
      CheckSignIdle,
      NotSigned,
      SignRequested,
      SignRejected,
      SignTimedOut,
      SignFailed,
      Signed,
    } = composeStories(stories);
    const onClickSpy = vi.fn();

    describe('Scenario: CheckSignIdle, Signed', () => {
      it('should be empty', () => {
        // Act
        const result1 = render(<CheckSignIdle />);
        const result2 = render(<Signed />);
        // Assert
        expect(result1.container.childElementCount).toEqual(2);
        expect(result2.container.childElementCount).toEqual(3);
      });
    });

    describe('Scenario: NotSigned', () => {
      it('should be visible and show info', () => {
        // Arrange
        const expectedTitle = 'Sign Required';
        // Act
        const { asFragment, getByText } = render(<NotSigned />);
        // Assert
        const actualTitle = getByText(expectedTitle);

        expect(actualTitle).toBeVisible();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: SignRequested', () => {
      it('should be visible and show information', () => {
        // Arrange
        const expectedMessage = 'Waiting for the login request to be signed.';
        const expectedCounter = SignRequested.args?.signCounter || 0;
        const expectedCounterText = `${expectedCounter}s`;
        // Act
        const { asFragment, getByText } = render(<SignRequested />);
        // Assert
        const actualMessage = getByText(new RegExp(expectedMessage, 'i'));
        const actualCounter = getByText(expectedCounterText);

        expect(actualMessage).toHaveTextContent(expectedMessage);
        expect(actualCounter).toBeVisible();
        expect(actualCounter).toHaveTextContent(expectedCounterText);
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: SignRejected', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Sign Rejected';
        const expectedErrorMessage = 'You rejected the sign request.';
        // Act
        const { asFragment, getByText } = render(
          <SignRejected onSign={onClickSpy} />
        );
        getByText('Sign In').click();
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

    describe('Scenario: SignTimedOut', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Sign Timed Out';
        const expectedErrorMessage =
          "You didn't respond to the sign request in time.";
        // Act
        const { asFragment, getByText } = render(
          <SignTimedOut onSign={onClickSpy} />
        );
        getByText('Sign In').click();
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

    describe('Scenario: SignFailed', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Unexpected Error';
        const expectedErrorMessage =
          SignFailed.args?.errorMessage || '==not_exist==';
        // Act
        const { asFragment, getByText } = render(<SignFailed />);
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
