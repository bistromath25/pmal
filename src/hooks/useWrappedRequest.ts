import { useCallback, useState } from 'react';
import { useApp } from '@/contexts/app';

export default function useWrappedRequest() {
  const { setLoading: setAppLoading, setError: setAppError } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrappedRequest = useCallback(
    async <T>(promise: () => Promise<T>): Promise<T | null> => {
      try {
        setLoading(true);
        setAppLoading(true);
        setError(null);
        setAppError(null);
        return await promise();
      } catch (error) {
        setError(error as string);
        setAppError(error as string);
        return null;
      } finally {
        setLoading(false);
        setAppLoading(false);
      }
    },
    [setAppError, setAppLoading]
  );
  const resetError = useCallback(() => setError(null), []);
  return { loading, wrappedRequest, error, resetError };
}
