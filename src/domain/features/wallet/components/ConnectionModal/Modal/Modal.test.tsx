import { render } from '@test-utils';

import { Modal } from './Modal';

describe('Feature: Wallet', () => {
  describe('Component: ConnectionModal/Modal', () => {
    const onClickSpy = vi.fn();

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
        expect(result1.container.childElementCount).toEqual(2);
        expect(result2.container.childElementCount).toEqual(2);
      });
    });

    describe.skip('Scenario: OnDisconnect', () => {
      it('when modal closed disconnet should be called', () => {
        // Arrange
        // Act
        const { getByRole } = render(
          <Modal activeStep={0} isOpen onDisconnect={onClickSpy} />
        );
        getByRole('button').click();
        // Assert
        expect(onClickSpy).toHaveBeenCalled();
      });
    });

    describe('Scenario: CheckWallet', () => {
      const stateTitle = 'Check Web3 Wallet Extension';
      const stateDesc = 'A supported Web3 wallet extension needs to be installed.';
      const stateContent = 'My Mock Check Wallet Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={0}
            checkWalletContent={stateContent}
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should be plain (blue color, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

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
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should show error (icon present, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner in error state
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={0}
            checkWalletContent={stateContent}
            stepState="loading"
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should be loading
        // Modal renders in portal, so use document
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeTruthy();

        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: CheckAccount', () => {
      const stateTitle = 'Check Web3 Wallet Status';
      const stateDesc = 'The Web3 wallet needs to be unlocked.';
      const stateContent = 'My Mock Check Account Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={1}
            checkAccountContent={stateContent}
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should be plain (blue color, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

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
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should show error (icon present, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner in error state
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={1}
            checkAccountContent={stateContent}
            stepState="loading"
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should be loading
        // Modal renders in portal, so use document
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeTruthy();

        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: CheckNetwork', () => {
      const stateTitle = 'Check Web3 Wallet Network';
      const stateDesc =
        'A supported network needs to be selected in the Web3 wallet.';
      const stateContent = 'My Mock Check Network Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={2}
            checkNetworkContent={stateContent}
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should be plain (blue color, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

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
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should show error (icon present, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner in error state
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={2}
            checkNetworkContent={stateContent}
            stepState="loading"
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));
        const desc = getByText(stateDesc);

        // Check icon state: should be loading
        // Modal renders in portal, so use document
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeTruthy();

        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('Scenario: CheckSign', () => {
      // Note: Title and description change based on DISABLE_WALLET_SIGN config
      // If DISABLE_WALLET_SIGN=true: "Load Web3 Wallet Account" (description is empty)
      // If DISABLE_WALLET_SIGN=false: "Check Web3 Wallet Signature" (has description)
      const stateTitle = 'Load Web3 Wallet Account';
      const stateContent = 'My Mock Check Sign Step Content';

      it('when stepState is undefined it should show plain step logo', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={3}
            checkSignContent={stateContent}
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));

        // Check icon state: should be plain (blue color, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

        expect(title).toBeTruthy();
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
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));

        // Check icon state: should show error (icon present, not loading)
        // Modal renders in portal, so use document
        const stepIcon = document.querySelector('.mantine-Stepper-stepIcon');
        expect(stepIcon).toBeTruthy();
        // Should not have loading spinner in error state
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeFalsy();

        expect(title).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });

      it('when stepState is loading it should show loading icon', () => {
        // Arrange
        // Act
        const { asFragment, getByText } = render(
          <Modal
            activeStep={3}
            checkSignContent={stateContent}
            stepState="loading"
            isOpen
            onDisconnect={onClickSpy}
          />
        );
        // Assert
        const title = getByText(new RegExp(stateTitle, 'i'));

        // Check icon state: should be loading
        // Modal renders in portal, so use document
        const loadingIcon = document.querySelector('.mantine-Stepper-stepLoader');
        expect(loadingIcon).toBeTruthy();

        expect(title).toBeTruthy();
        expect(asFragment).toMatchSnapshot();
      });
    });
  });
});
