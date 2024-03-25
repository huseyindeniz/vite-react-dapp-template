import {
  Box,
  Button,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';

export const WhySignNeeded: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        size="xs"
        colorScheme="yellow"
        onClick={onOpen}
        fontWeight={'normal'}
      >
        Why On Earth I'd Sign With My Wallet? Is it safe?
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Why Sign Needed? Is it Safe?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Heading fontSize="sm" fontWeight={'normal'}>
                🔐 Why Personal Sign? Ensuring Your Security
              </Heading>
              <Box>
                Connecting your Web3 wallet? You'll encounter a request for
                personal sign-in. It's different from eth sign and designed for
                your safety.
              </Box>
              <Heading fontSize="xs" fontWeight={'normal'}>
                Personal Sign: Safe and Secure
              </Heading>
              <Box>
                Personal sign verifies your wallet without enabling
                transactions—entirely secure, no risk to your funds. We use it
                solely to confirm wallet authenticity.
              </Box>
              <Heading fontSize="xs" fontWeight={'normal'}>
                Eth Sign: Beware of Risks
              </Heading>
              <Box>
                Eth sign is risky, allowing external access to drain your
                wallet. We don't request it—avoid signing eth requests on
                unfamiliar sites to protect your assets.
              </Box>
              <Box>
                <Button
                  as={Link}
                  href="https://docs.metamask.io/wallet/how-to/sign-data/#use-personal_sign"
                  isExternal
                  variant="ghost"
                  size="xs"
                  rightIcon={<FiExternalLink />}
                  fontWeight={'normal'}
                >
                  More Info
                </Button>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
