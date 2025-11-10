import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../services/api';
import * as api from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Custom hook for health check
export function useHealthCheck() {
  const [state, setState] = useState<UseApiState<{ message: string; timestamp: string }>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev: UseApiState<{ message: string; timestamp: string }>) => ({ ...prev, loading: true, error: null }));
    const result = await api.checkHealth();
    
    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: result.error || 'Failed to fetch health status',
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Custom hook for products
export function useProducts(token?: string) {
  const [state, setState] = useState<UseApiState<Product[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev: UseApiState<Product[]>) => ({ ...prev, loading: true, error: null }));
    const result = await api.getProducts(token);
    
    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: result.error || 'Failed to fetch products',
      });
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Custom hook for a single product
export function useProduct(id: string, token?: string) {
  const [state, setState] = useState<UseApiState<Product>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev: UseApiState<Product>) => ({ ...prev, loading: true, error: null }));
    const result = await api.getProductById(id, token);
    
    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: result.error || 'Failed to fetch product',
      });
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}