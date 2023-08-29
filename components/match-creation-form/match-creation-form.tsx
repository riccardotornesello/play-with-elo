import { useState } from 'react';

export default function MatchCreationForm({ players, handleSubmit }) {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homePlayerId, setHomePlayerId] = useState('');
  const [awayPlayerId, setAwayPlayerId] = useState('');
  const [homePoints, setHomePoints] = useState('');
  const [awayPoints, setAwayPoints] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      homeTeam,
      awayTeam,
      homePlayerId,
      awayPlayerId,
      homePoints,
      awayPoints,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='homeTeam'>Home team:</label>
      <br />
      <input
        type='text'
        id='homeTeam'
        name='homeTeam'
        value={homeTeam}
        onChange={(e) => setHomeTeam(e.target.value)}
      />
      <br />

      <label htmlFor='awayTeam'>Away team:</label>
      <br />
      <input
        type='text'
        id='awayTeam'
        name='awayTeam'
        value={awayTeam}
        onChange={(e) => setAwayTeam(e.target.value)}
      />
      <br />

      <label htmlFor='homePlayerId'>Home player:</label>
      <br />
      <select
        id='homePlayerId'
        name='homePlayerId'
        value={homePlayerId}
        onChange={(e) => setHomePlayerId(e.target.value)}
      >
        <option value=''>Select a player</option>
        {players.map((player) => (
          <option value={player.id} key={player.id}>
            {player.fullName} aka {player.username}
          </option>
        ))}
      </select>
      <br />

      <label htmlFor='awayPlayerId'>Away player:</label>
      <br />
      <select
        id='awayPlayerId'
        name='awayPlayerId'
        value={awayPlayerId}
        onChange={(e) => setAwayPlayerId(e.target.value)}
      >
        <option value=''>Select a player</option>
        {players.map((player) => (
          <option value={player.id} key={player.id}>
            {player.fullName} aka {player.username}
          </option>
        ))}
      </select>
      <br />

      <label htmlFor='homePoints'>Home points:</label>
      <br />
      <input
        type='number'
        id='homePoints'
        name='homePoints'
        value={homePoints}
        onChange={(e) => setHomePoints(parseInt(e.target.value))}
      />
      <br />

      <label htmlFor='awayPoints'>Away points:</label>
      <br />
      <input
        type='number'
        id='awayPoints'
        name='awayPoints'
        value={awayPoints}
        onChange={(e) => setAwayPoints(parseInt(e.target.value))}
      />
      <br />

      <button type='submit'>Submit</button>
    </form>
  );
}
