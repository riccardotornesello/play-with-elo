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
import { leagueCreateSchema, LeagueCreateSchema } from '../../features/leagues/schemas/leagues';
import { pushFormErrors } from '../../lib/form';

export type LeagueCreationFormProps = {
  onSuccess: () => void;
};

export default function LeagueCreationForm({
  onSuccess,
}: LeagueCreationFormProps) {
  const { mutate, apiStatus } = useMutation('/api/leagues', {
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LeagueCreateSchema>({
    resolver: zodResolver(leagueCreateSchema),
  });

  const onSubmit: SubmitHandler<LeagueCreateSchema> = async (data) => {
    mutate(data, {
      onError: (errorBody, statusCode) => {
        if (statusCode == 400) {
          pushFormErrors(errorBody, setError);
        }
      },
    });
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

          <FormControl isInvalid={errors.description !== undefined}>
            <FormLabel>Description</FormLabel>
            <Input {...register('description')} />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.teamName !== undefined}>
            <FormLabel>Team name</FormLabel>
            <Input {...register('teamName')} />
            <FormErrorMessage>{errors.teamName?.message}</FormErrorMessage>
          </FormControl>

          <Button
            isLoading={
              apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
            }
            type='submit'
            loadingText='Submitting'
            mt='6'
          >
            Create a new league
          </Button>
        </form>
      </Stack>
    </>
  );
}
