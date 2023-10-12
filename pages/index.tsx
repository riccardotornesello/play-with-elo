'use client';

// Components
import {
  Stack,
  Flex,
  Text,
  VStack,
  useBreakpointValue,
  Heading,
} from '@chakra-ui/react';
import ButtonLink from '../components/basic/button-link';
// Pictures
import Pitch from '../assets/pictures/pitch.jpg';

export default function HomePage() {
  return (
    <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={`url(${Pitch.src})`}
      backgroundSize={'cover'}
      backgroundPosition={'center center'}
    >
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.700, blackAlpha.400)'}
      >
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Heading
            as='h2'
            color={'green.300'}
            fontWeight={700}
            lineHeight={1.2}
            size={useBreakpointValue({ base: 'xl', md: '2xl' })}
          >
            Create your league.
            <br />
            Compete.
            <br />
            Be the best.
            <br />
          </Heading>

          <ButtonLink href='/dashboard' colorScheme='teal' px='50px'>
            Get started
          </ButtonLink>

          <Text color='white' mt={5}>
            The interface is a 💩, I'm a backend developer
          </Text>
        </Stack>
      </VStack>
    </Flex>
  );
}
