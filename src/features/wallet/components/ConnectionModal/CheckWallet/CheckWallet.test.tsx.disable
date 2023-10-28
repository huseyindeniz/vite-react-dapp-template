import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';

import * as stories from './CheckWallet.stories';

describe('Feature: Wallet', () => {
  describe('Component: ConnectionModal/Steps/CheckWallet', () => {
    const {
      CheckWalletIdle,
      InitRequested,
      NotSupported,
      InitFailed,
      Initialized,
    } = composeStories(stories);
    const onClickSpy = jest.fn();

    describe('Scenario: CheckWalletIdle, InitRequested, Initialized', () => {
      it('should be empty', () => {
        // Act
        const result1 = render(<CheckWalletIdle />);
        const result2 = render(<InitRequested />);
        const result3 = render(<Initialized />);
        // Assert
        expect(result1.container.childElementCount).toEqual(0);
        expect(result2.container.childElementCount).toEqual(0);
        expect(result3.container.childElementCount).toEqual(0);
      });
    });

    describe('Scenario: NotSupported', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Metamask Is Not Detected';
        const expectedErrorMessage =
          'The Metamask wallet extension is not detected in your browser.';
        // Act
        const { asFragment, getByText } = render(
          <NotSupported onCancel={onClickSpy} />
        );
        getByText('Cancel').click();
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

    describe('Scenario: InitFailed', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Metamask Is Not Detected';
        const expectedErrorMessage =
          'The Metamask wallet extension is not detected in your browser.';
        // Act
        const { asFragment, getByText } = render(
          <InitFailed onCancel={onClickSpy} />
        );
        getByText('Cancel').click();
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
  });
});
