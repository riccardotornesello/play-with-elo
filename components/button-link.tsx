import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function ButtonLink({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  [x: string]: any;
}) {
  return (
    <Button as={NextLink} href={href} {...props}>
      {children}
    </Button>
  );
}
