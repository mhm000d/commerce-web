import {useState} from "react";
import getErrorMessage from "@/lib/error-messages";
import {toast} from "sonner";

export function useRetry<T>(fn: () => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (showToast = true) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(getErrorMessage(err));
      if (showToast) toast.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return {execute, loading, error, data, setData};
}