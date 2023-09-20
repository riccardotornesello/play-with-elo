import { useState } from 'react';

export enum ApiStatus {
  Idle = 1,
  Loading = 2,
  Success = 3,
  Error = 4,
}

export type MutationOptions = {
  method?: string;
  onSuccess?: (data: any, input: any) => void;
};

export function useMutation(url: string, options: MutationOptions = {}) {
  const [apiStatus, setApiStatus] = useState(ApiStatus.Idle);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const mutate = async (data: any) => {
    setApiStatus(ApiStatus.Loading);
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
        throw new Error(json.message);
      }
      setData(json);
      setApiStatus(ApiStatus.Success);
      options.onSuccess && options.onSuccess(json, data);
    } catch (error) {
      setError(error);
      setApiStatus(ApiStatus.Error);
    }
  };

  return { mutate, apiStatus, error, data };
}
