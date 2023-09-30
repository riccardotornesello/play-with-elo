import { useRouter } from 'next/router';
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
import {
  leagueInvitationSchema,
  LeagueInvitationSchema,
} from '../../schemas/leagues';

export type LeagueInvitationFormProps = {
  onSuccess: () => void;
};

export default function LeagueInvitationForm({
  onSuccess,
}: LeagueInvitationFormProps) {
  const router = useRouter();
  const { id } = router.query;

  const { mutate, apiStatus } = useMutation(`/api/leagues/${id}/invitations`, {
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueInvitationSchema>({
    resolver: zodResolver(leagueInvitationSchema),
  });

  const onSubmit: SubmitHandler<LeagueInvitationSchema> = async (data) => {
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
