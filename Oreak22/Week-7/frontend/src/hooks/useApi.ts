import { useState } from "react";
import toast from "react-hot-toast";

export const useApi = <TArgs extends any[], TData>(
  fn: (...args: TArgs) => Promise<{ data: TData }>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exec = async (...args: TArgs): Promise<TData | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      return res.data as TData;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { exec, loading, error };
};
