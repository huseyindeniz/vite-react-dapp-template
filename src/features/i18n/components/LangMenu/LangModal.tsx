import {
  Image,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  Group,
  Text,
} from '@mantine/core';

import imageTrFlag from '../../assets/images/flags/tr.webp';
import imageUsFlag from '../../assets/images/flags/us.webp';
import { LangCode } from '../../types/LangCode';
import { SupportedLang } from '../../types/SupportedLang';

import classes from './LangModal.module.css';

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
    <Modal opened={isOpen} onClose={onClose} title="Language Selection">
      <RadioGroup
        defaultValue={defaultValue}
        onChange={onChange}
        onClick={() => null}
      >
        <Stack>
          {supportedLanguages.map(l => (
            <Radio.Card
              radius="md"
              value={l.code}
              key={l.code}
              className={classes.root}
            >
              <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />
                <Text>
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
                </Text>
              </Group>
            </Radio.Card>
          ))}
        </Stack>
      </RadioGroup>
    </Modal>
  );
};
