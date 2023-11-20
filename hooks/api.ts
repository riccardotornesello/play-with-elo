'use client';

import { useState } from 'react';

export enum ApiStatus {
  Idle = 1,
  Loading = 2,
  Success = 3,
  Error = 4,
}

export type MutationOptions = {
  method?: string;
  onRun?: (input: any) => void;
  onSuccess?: (data: any, input: any) => void;
  onError?: (error: any, status: number, input: any) => void;
};

export function useMutation(url: string, globalOptions: MutationOptions = {}) {
  const [apiStatus, setApiStatus] = useState(ApiStatus.Idle);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const mutate = async (data: any, subOptions: MutationOptions = {}) => {
    const options = { ...globalOptions, ...subOptions };

    setApiStatus(ApiStatus.Loading);

    options.onRun && options.onRun(data);

    try {
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();

      if (!response.ok) {
        options.onError && options.onError(json, response.status, data);
        throw new Error(json.message);
      } else {
        setData(json);
        setApiStatus(ApiStatus.Success);
        options.onSuccess && options.onSuccess(json, data);
      }
    } catch (error) {
      setError(error);
      setApiStatus(ApiStatus.Error);
    }
  };

  return { mutate, apiStatus, error, data };
}
