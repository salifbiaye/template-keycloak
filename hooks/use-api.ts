'use client';

import { useState, useCallback } from 'react';
import { ApiProxy, ApiProxyOptions } from '@/lib/api-proxy';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<T | null>;
  reset: () => void;
}

interface UseApiOptions extends ApiProxyOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Hook pour les requêtes GET
export function useApiGet<T = any>(
  url: string,
  apiProxy: ApiProxy,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError, ...apiOptions } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiProxy.get<T>(url, apiOptions);
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(errorMessage);
      return null;
    }
  }, [url, apiProxy, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Exécution immédiate si demandée
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { ...state, execute, reset };
}

// Hook pour les requêtes de mutation (POST, PUT, PATCH, DELETE)
export function useApiMutation<TData = any, TVariables = any>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  apiProxy: ApiProxy,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError, ...apiOptions } = options;

  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = useCallback(async (variables?: TVariables): Promise<TData | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let data: TData;

      switch (method) {
        case 'POST':
          data = await apiProxy.post<TData>(url, variables, apiOptions);
          break;
        case 'PUT':
          data = await apiProxy.put<TData>(url, variables, apiOptions);
          break;
        case 'PATCH':
          data = await apiProxy.patch<TData>(url, variables, apiOptions);
          break;
        case 'DELETE':
          data = await apiProxy.delete<TData>(url, apiOptions);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(errorMessage);
      return null;
    }
  }, [method, url, apiProxy, onSuccess, onError, apiOptions]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}

// Hooks spécialisés pour chaque méthode
export function useApiPost<TData = any, TVariables = any>(
  url: string,
  apiProxy: ApiProxy,
  options: UseApiOptions = {}
) {
  return useApiMutation<TData, TVariables>('POST', url, apiProxy, options);
}

export function useApiPut<TData = any, TVariables = any>(
  url: string,
  apiProxy: ApiProxy,
  options: UseApiOptions = {}
) {
  return useApiMutation<TData, TVariables>('PUT', url, apiProxy, options);
}

export function useApiPatch<TData = any, TVariables = any>(
  url: string,
  apiProxy: ApiProxy,
  options: UseApiOptions = {}
) {
  return useApiMutation<TData, TVariables>('PATCH', url, apiProxy, options);
}

export function useApiDelete<TData = any>(
  url: string,
  apiProxy: ApiProxy,
  options: UseApiOptions = {}
) {
  return useApiMutation<TData, never>('DELETE', url, apiProxy, options);
}