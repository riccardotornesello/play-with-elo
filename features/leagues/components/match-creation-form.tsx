// Components
import {
  Select,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  Box,
  Heading,
  Button,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
// Db
import { League, Player } from '../models/league';
// Form
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { matchCreateSchema, MatchCreateSchema } from '../schemas/matches';
// Api
import { ApiStatus, useMutation } from '../../../hooks/api';

export type MatchCreationFormProps = {
  league: League;
};

type PlayerCardProps = {
  players: Player[];
  id: number;
  register: UseFormRegister<MatchCreateSchema>;
  setValue: UseFormSetValue<MatchCreateSchema>;
  errors: FieldErrors<MatchCreateSchema>;
};

export default function MatchCreationForm({ league }: MatchCreationFormProps) {
  const { mutate, apiStatus } = useMutation(`/api/leagues/${league._id.toString()}/matches`, {
    onSuccess: () => {
      window.location.reload();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MatchCreateSchema>({
    resolver: zodResolver(matchCreateSchema),
  });

  const onSubmit: SubmitHandler<MatchCreateSchema> = async (data) => {
    mutate(data);
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
      <PlayerCard
        players={league.players}
        register={register}
        setValue={setValue}
        errors={errors}
        id={0}
      />
      <PlayerCard
        players={league.players}
        register={register}
        setValue={setValue}
        errors={errors}
        id={1}
      />
      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient='linear(to-r, red.400,pink.400)'
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, red.400,pink.400)',
          boxShadow: 'xl',
        }}
        type='submit'
        isLoading={
          apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
        }
      >
        Submit
      </Button>
    </Box>
  );
}

function PlayerCard({
  players,
  id,
  register,
  setValue,
  errors,
}: PlayerCardProps) {
  return (
    <Box p={3} borderWidth='1px' borderRadius='lg'>
      <Heading as='h3' size='md' mb={3}>
        Player {id}
      </Heading>
      <Grid
        gap={6}
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isInvalid={errors.players?.[id]?.playerId !== undefined}>
            <Select
              placeholder='Select player'
              {...register(`players.${id}.playerId`)}
            >
              {players.map((player, i) => (
                <option value={player._id.toString()} key={i}>
                  {player.teamName} ({player.rating})
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {errors.players?.[id]?.playerId?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={errors.players?.[id]?.points !== undefined}>
            <PointsInput
              players={players}
              id={id}
              register={register}
              setValue={setValue}
              errors={errors}
            />
            <FormErrorMessage>
              {errors.players?.[id]?.points?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
    </Box>
  );
}

function PointsInput({
  players,
  errors,
  id,
  register,
  setValue,
}: PlayerCardProps) {
  const { onBlur, name, ref } = register(`players.${id}.points`, {
    valueAsNumber: true,
  });
  const onChange = (valueAsString: string, valueAsNumber: number) => {
    setValue(`players.${id}.points`, valueAsNumber);
  };

  return (
    <NumberInput onBlur={onBlur} name={name} ref={ref} onChange={onChange}>
      <NumberInputField placeholder='Points' />
    </NumberInput>
  );
}
