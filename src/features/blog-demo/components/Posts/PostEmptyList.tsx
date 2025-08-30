import { Alert } from '@mantine/core';

export const PostEmptyList: React.FC = () => {
  return (
    <Alert title="No Posts Available" color="gray">
      There are no posts to display.
    </Alert>
  );
};
