import {
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

import imageTrFlag from '../../assets/images/flags/tr.webp';
import imageUsFlag from '../../assets/images/flags/us.webp';
import { LangCode, SupportedLang } from '../../types';

const imagesFlag: Record<LangCode, string> = {
  [LangCode.TR_TR]: imageTrFlag,
  [LangCode.EN_US]: imageUsFlag,
};

export interface LangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (_nextValue: string) => void;
  defaultValue: string;
  supportedLanguages: SupportedLang[];
}

export const LangModal: React.FC<LangModalProps> = ({
  isOpen,
  onClose,
  onChange,
  defaultValue,
  supportedLanguages,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Language Selection
          <Divider mt={1} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>
          <RadioGroup
            defaultValue={defaultValue}
            onChange={onChange}
            onClick={() => null}
          >
            <Stack>
              {supportedLanguages.map(l => (
                <Radio key={l.code} value={l.code}>
                  <Image
                    src={imagesFlag[l.code]}
                    style={{
                      margin: '0.4em',
                      width: '1.6em',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  />
                  {l.label}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
