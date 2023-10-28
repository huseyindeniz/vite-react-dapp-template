import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export interface AlertMessageProps {
  status?: 'error' | 'info' | 'warning' | 'success' | 'loading' | undefined;
  title: string;
  children: React.ReactNode;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  status = 'error',
  title,
  children,
}) => {
  return (
    <Alert
      status={status}
      rounded="md"
      boxShadow="md"
      textAlign="center"
      variant={'left-accent'}
    >
      <AlertIcon />
      <AlertTitle fontSize={'xs'} w={'30%'}>
        {title}
      </AlertTitle>
      <AlertDescription fontSize={'xs'} overflow={'auto'} w="full">
        {children}
      </AlertDescription>
    </Alert>
  );
};
