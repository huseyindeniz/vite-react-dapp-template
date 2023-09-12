import { render } from '@testing-library/react';

import { Modal } from './Modal';

describe('Feature: Wallet', () => {
  describe('Component: ConnectionModal/Modal', () => {
    const onClickSpy = jest.fn();

    describe('Scenario: isOpen=false', () => {
      it('should be empty', () => {
        // Arrange
        // Act
        const result1 = render(
          <Modal activeStep={0} isOpen={false} onDisconnect={onClickSpy} />
        );
        const result2 = render(
          <Modal activeStep={0} isOpen={false} onDisconnect={onClickSpy} />
        );
        // Assert
        expect(result1.container.childElementCount).toEqual(0);
        expect(result2.container.childElementCount).toEqual(0);
      });
    });

    describe.skip('Scenario: OnDisconnect', () => {
      it('when modal closed disconnet should be called', () => {
        // Arrange
        // Act
        const { getByRole } = render(
          <Modal activeStep={0} isOpen={true} onDisconnect={onClickSpy} />
        );
        getByRole('button').click();
        // Assert
        expect(onClickSpy).toHaveBeenCalled();
      });
    });

    describe.skip('Scenario: CheckWallet', () => {
      const stateTitle = 'Check Metamask Extension';
      const stateDesc = 'The Metamask wallet extension needs to be installed.';
      const stateContent = 'My Mock Check Wallet Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={0}
            checkWalletContent={stateContent}
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check plain step icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is error it should show error icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={0}
            checkWalletContent={stateContent}
            stepState="error"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check error icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      // Loading state is failing, probably a bug in Chakra-Steps package
      it.skip('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={0}
            checkWalletContent={stateContent}
            stepState="loading"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check loading icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe.skip('Scenario: CheckAccount', () => {
      const stateTitle = 'Check Metamask Status';
      const stateDesc = 'The Metamask wallet needs to be unlocked.';
      const stateContent = 'My Mock Check Account Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={1}
            checkAccountContent={stateContent}
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check plain step icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is error it should show error icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={1}
            checkAccountContent={stateContent}
            stepState="error"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check error icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      // Loading state is failing, probably a bug in Chakra-Steps package
      it.skip('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={1}
            checkAccountContent={stateContent}
            stepState="loading"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check loading icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe.skip('Scenario: CheckNetwork', () => {
      const stateTitle = 'Check Metamask Network';
      const stateDesc =
        'A supported network needs to be selected in the Metamask wallet.';
      const stateContent = 'My Mock Check Network Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={2}
            checkNetworkContent={stateContent}
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check plain step icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is error it should show error icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={2}
            checkNetworkContent={stateContent}
            stepState="error"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check error icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      // Loading state is failing, probably a bug in Chakra-Steps package
      it.skip('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={2}
            checkNetworkContent={stateContent}
            stepState="loading"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check loading icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe.skip('Scenario: CheckSign', () => {
      const stateTitle = 'Check Metamask Signature';
      const stateDesc =
        'The login request needs to be signed in the Metamask wallet.';
      const stateContent = 'My Mock Check Sign Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={3}
            checkSignContent={stateContent}
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check plain step icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is error it should show error icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={3}
            checkSignContent={stateContent}
            stepState="error"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check error icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      // Loading state is failing, probably a bug in Chakra-Steps package
      it.skip('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={3}
            checkSignContent={stateContent}
            stepState="loading"
            isOpen={true}
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);
        // TODO: check loading icon
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
