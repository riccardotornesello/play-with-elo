import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Button,
} from '@chakra-ui/react';
import { ApiStatus, useMutation } from '../../hooks/api';
import { leagueCreateSchema, LeagueCreateSchema } from '../../schemas/leagues';

export default function LeagueCreationForm() {
  const { mutate, apiStatus, error, data } = useMutation('/api/leagues');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueCreateSchema>({
    resolver: zodResolver(leagueCreateSchema),
  });

  const onSubmit: SubmitHandler<LeagueCreateSchema> = async (data) => {
    mutate(data);
  };

  return (
    <>
      <Stack spacing='6'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.name !== undefined}>
            <FormLabel>Name</FormLabel>
            <Input {...register('name')} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <Button
            isLoading={apiStatus === ApiStatus.Loading}
            type='submit'
            loadingText='Submitting'
          >
            Create a new league
          </Button>
        </form>
      </Stack>
      {apiStatus === ApiStatus.Error && <p>Error</p>}
      {apiStatus === ApiStatus.Success && <p>Success</p>}
    </>
  );
}
