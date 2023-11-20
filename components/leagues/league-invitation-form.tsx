import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import {
  LeagueInvitationCreateSchema,
  leagueInvitationCreateSchema,
} from '../../features/leagues/schemas/invitation';
import { ApiStatus, useMutation } from '../../hooks/api';

export type LeagueInvitationFormProps = {};

export default function LeagueInvitationForm({}: LeagueInvitationFormProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { mutate, apiStatus } = useMutation(`/api/leagues/${id}/invitations`, {
    onSuccess: () => {
      window.location.reload();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueInvitationCreateSchema>({
    resolver: zodResolver(leagueInvitationCreateSchema),
  });

  const onSubmit: SubmitHandler<LeagueInvitationCreateSchema> = async (
    data,
  ) => {
    mutate(data);
  };

  return (
    <>
      <Stack spacing='6'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username !== undefined}>
            <FormLabel>Username</FormLabel>
            <Input {...register('username')} />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          <Button
            isLoading={
              apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
            }
            type='submit'
            loadingText='Submitting'
            mt='6'
          >
            Invite the user
          </Button>
        </form>
      </Stack>
      {apiStatus === ApiStatus.Error && <p>Error</p>}
    </>
  );
}
