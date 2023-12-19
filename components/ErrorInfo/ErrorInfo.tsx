import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

export type ErrorInfoProps = {
  title?: string;
  children: string | null;
};

export function ErrorInfo({ children, title }: ErrorInfoProps) {
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
