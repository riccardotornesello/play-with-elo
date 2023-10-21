import { Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Link({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  [x: string]: any;
}) {
  return (
    <NextLink href={href} passHref legacyBehavior={true}>
      <ChakraLink {...props}>{children}</ChakraLink>
    </NextLink>
  );
}
