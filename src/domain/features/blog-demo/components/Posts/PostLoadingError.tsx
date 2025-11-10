import { Alert, Button } from '@mantine/core';
import { FaExclamationTriangle } from 'react-icons/fa';

export interface PostLoadingErrorProps {
  error: string;
}

export const PostLoadingError: React.FC<PostLoadingErrorProps> = ({
  error,
}) => {
  return (
    <Alert
      icon={<FaExclamationTriangle size={16} />}
      title="Error"
      color="red"
      withCloseButton
    >
      {error}
      <Button
        variant="light"
        color="red"
        size="xs"
        mt="sm"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </Alert>
  );
};
