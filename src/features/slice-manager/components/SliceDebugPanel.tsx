import { useEffect, useState } from 'react';

import { useSliceManager } from '../hooks/useSliceManager';

export const SliceDebugPanel = () => {
  const { getSliceStatus, getFeatureStatus, cleanupAll } = useSliceManager();
  const [status, setStatus] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus({
        slices: getSliceStatus(),
        features: getFeatureStatus(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [getSliceStatus, getFeatureStatus]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'white',
        padding: 10,
        border: '1px solid #ccc',
      }}
    >
      <h3>Slice Status</h3>
      <button type="button" onClick={cleanupAll}>
        Cleanup All Inactive
      </button>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
};
