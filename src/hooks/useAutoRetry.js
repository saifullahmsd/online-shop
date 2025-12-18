import { useEffect, useState } from "react";

/**
 * Automatically retries a failed API call with exponential backoff.
 * @param {boolean} isError - The error state from RTK Query
 * @param {function} refetch - The function to call to retry the request
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 */
const useAutoRetry = (isError, refetch, maxRetries = 3) => {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isError && retryCount < maxRetries) {
      // Exponential Backoff: Wait 1s, then 2s, then 4s
      const delay = Math.pow(2, retryCount) * 1000;

      const timer = setTimeout(() => {
        console.log(`Auto-retrying... Attempt ${retryCount + 1}`);
        setRetryCount((prev) => prev + 1);
        refetch();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isError, retryCount, maxRetries, refetch]);

  useEffect(() => {
    if (!isError) {
      setRetryCount(0);
    }
  }, [isError]);

  return retryCount;
};

export default useAutoRetry;
