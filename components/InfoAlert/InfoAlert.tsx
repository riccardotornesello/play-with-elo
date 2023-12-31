import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

export type InfoAlertProps = {
  title?: string;
  children: string | null;
};

export function ErrorInfo({ children, title }: InfoAlertProps) {
  if (!children) {
    return null;
  }

  const icon = <IconExclamationCircle />;
  return (
    <Alert variant="light" color="red" title={title} icon={icon}>
      {children}
    </Alert>
  );
}

export function SuccessInfo({ children, title }: InfoAlertProps) {
  if (!children) {
    return null;
  }

  return (
    <Alert variant="light" color="green" title={title}>
      {children}
    </Alert>
  );
}
