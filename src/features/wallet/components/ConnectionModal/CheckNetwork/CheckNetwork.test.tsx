import { composeStories } from '@storybook/react';
import { render } from '@test-utils';

import * as stories from './CheckNetwork.stories';

describe('Feature: Wallet', () => {
  describe('Component: ConnectionModal/Steps/CheckNetwork', () => {
    const {
      CheckNetworkIdle,
      NetworkRequested,
      NetworkDetectionFailed,
      WrongNetwork,
      NetworkSwitchRequested,
      NetworkSwitchRejected,
      NetworkSwitchFailed,
      NetworkLoaded,
    } = composeStories(stories);
    const onClickSpy = vi.fn();

    describe('Scenario: CheckNetworkIdle, NetworkRequested, NetworkLoaded', () => {
      it('should be empty', () => {
        // Act
        const result1 = render(<CheckNetworkIdle />);
        const result2 = render(<NetworkRequested />);
        const result3 = render(<NetworkLoaded />);
        // Assert
        expect(result1.container.childElementCount).toEqual(2);
        expect(result2.container.childElementCount).toEqual(2);
        expect(result3.container.childElementCount).toEqual(2);
      });
    });

    describe('Scenario: NetworkDetectionFailed', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Unexpected Error';
        const expectedErrorMessage =
          NetworkDetectionFailed.args?.errorMessage || '==not_exist==';
        // Act
        const { asFragment, getByText } = render(<NetworkDetectionFailed />);
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

    describe('Scenario: WrongNetwork', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Wrong Network';
        const expectedErrorMessage =
          'Current network is not supported by this app.';
        // Act
        const { asFragment, getByText } = render(
          <WrongNetwork onSwitchNetwork={onClickSpy} />
        );
        getByText('Switch Network').click();
        // Assert
        const actualTitle = getByText(expectedTitle);
        const actualErrorMessage = getByText(
          new RegExp(expectedErrorMessage, 'i')
        );
        // TODO: check if network combobox exist with correct items
        expect(actualErrorMessage).toHaveTextContent(expectedErrorMessage);
        expect(actualTitle).toBeVisible();
        expect(onClickSpy).toHaveBeenCalled();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: NetworkSwitchRequested', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedMessage =
          'Waiting for the network switch request to be accepted.';
        // Act
        const { asFragment, getByText } = render(<NetworkSwitchRequested />);
        // Assert
        const actualMessage = getByText(new RegExp(expectedMessage, 'i'));

        expect(actualMessage).toHaveTextContent(expectedMessage);
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: NetworkSwitchRejected', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Switch Rejected';
        const expectedErrorMessage = 'You rejected the network switch request.';
        // Act
        const { asFragment, getByText } = render(
          <NetworkSwitchRejected onSwitchNetwork={onClickSpy} />
        );
        getByText('Switch Network').click();
        // Assert
        const actualTitle = getByText(expectedTitle);
        const actualErrorMessage = getByText(
          new RegExp(expectedErrorMessage, 'i')
        );
        // TODO: check if network combobox exist with correct items
        expect(actualErrorMessage).toHaveTextContent(expectedErrorMessage);
        expect(actualTitle).toBeVisible();
        expect(onClickSpy).toHaveBeenCalled();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: NetworkSwitchFailed', () => {
      it('should be visible and show error', () => {
        // Arrange
        const expectedTitle = 'Unexpected Error';
        const expectedErrorMessage =
          NetworkSwitchFailed.args?.errorMessage || '==not_exist==';
        // Act
        const { asFragment, getByText } = render(<NetworkSwitchFailed />);
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
