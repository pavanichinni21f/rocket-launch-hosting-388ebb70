import axios, { AxiosError, AxiosInstance } from 'axios';
import { supabase } from '@/integrations/supabase/client';

/**
 * Production-grade axios client with auth interceptor + standardized errors.
 */
const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network error';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
