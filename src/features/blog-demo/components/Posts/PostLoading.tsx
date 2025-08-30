import { Loader } from '@mantine/core';

export const PostLoading: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Loader color="blue" />
    </div>
  );
};
