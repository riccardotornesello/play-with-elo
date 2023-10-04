import { UseFormSetError } from 'react-hook-form';

export function pushFormErrors(
  responseBody: any,
  setError: UseFormSetError<any>,
) {
  responseBody.issues.forEach((issue: any) => {
    setError(issue.path.join('.'), {
      type: 'manual',
      message: issue.message,
    });
  });
}
