'use client';

import {
  Stack,
  Flex,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import ButtonLink from '../components/basic/button-link';

export default function WithBackgroundImage() {
  return (
    <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={
        'url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}
    >
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
      >
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}
          >
            Play with ELO{' '}
            <Text as={'span'} color={'blue.400'}>
              rating system
            </Text>
            <br />
            Website under construction
          </Text>
          <Stack direction={'row'}>
            <ButtonLink href='/dashboard' colorScheme='facebook'>
              dashboard
            </ButtonLink>
            <ButtonLink href='/auth/signup' colorScheme='facebook'>
              signup
            </ButtonLink>
            <ButtonLink href='/auth/signin' colorScheme='facebook'>
              signin
            </ButtonLink>
          </Stack>
        </Stack>
      </VStack>
    </Flex>
  );
}
