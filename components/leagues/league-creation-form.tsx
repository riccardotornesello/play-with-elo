import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormLabel, Input, Stack, Button } from '@chakra-ui/react';
import { ApiStatus, useMutation } from '../../hooks/api';
import {
  leagueCreateSchema,
  LeagueCreateSchema,
} from '../../schemas/leagues';

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
    console.log(data);
  };

  return (
    <>
      <Stack spacing='6'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input {...register('name')} />
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
      {apiStatus === ApiStatus.Error && <p>Error: {error}</p>}
      {apiStatus === ApiStatus.Success && <p>Success: {data}</p>}
    </>
  );
}
