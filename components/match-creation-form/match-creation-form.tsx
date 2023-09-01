'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MatchCreationForm({ players, handleSubmit }) {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homePlayerId, setHomePlayerId] = useState('');
  const [awayPlayerId, setAwayPlayerId] = useState('');
  const [homeScore, setHomePoints] = useState('');
  const [awayScore, setAwayPoints] = useState('');
  const [playedAt, setPlayedAt] = useState(new Date());

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      homeTeam,
      awayTeam,
      homePlayerId,
      awayPlayerId,
      homeScore,
      awayScore,
      playedAt,
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
            {player.username || player.fullName}
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
            {player.username || player.fullName}
          </option>
        ))}
      </select>
      <br />

      <label htmlFor='homeScore'>Home points:</label>
      <br />
      <input
        type='number'
        id='homeScore'
        name='homeScore'
        value={homeScore}
        onChange={(e) => setHomePoints(parseInt(e.target.value))}
      />
      <br />

      <label htmlFor='awayScore'>Away points:</label>
      <br />
      <input
        type='number'
        id='awayScore'
        name='awayScore'
        value={awayScore}
        onChange={(e) => setAwayPoints(parseInt(e.target.value))}
      />
      <br />

      <DatePicker
        onChange={(val) => setPlayedAt(val)}
        selected={playedAt}
        showTimeSelect
        dateFormat='Pp'
      />

      <button type='submit'>Submit</button>
    </form>
  );
}
