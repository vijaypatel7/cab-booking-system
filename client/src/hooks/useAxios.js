import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading, error, and data state
 * Supports optimistic updates
 */
export const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (apiCall, { onSuccess, onError, optimisticData } = {}) => {
      setLoading(true);
      setError(null);

      // If optimistic data is provided, call onSuccess immediately
      if (optimisticData && onSuccess) {
        onSuccess(optimisticData);
      }

      try {
        const response = await apiCall();
        const data = response.data;

        if (onSuccess) {
          onSuccess(data);
        }

        setLoading(false);
        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Something went wrong';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage);
        }

        setLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, request, clearError };
};
