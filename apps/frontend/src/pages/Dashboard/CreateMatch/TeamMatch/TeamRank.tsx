import { Box, Paper, Typography } from '@mui/material';
import { useContext, VFC } from 'react';
import { useDrop } from 'react-dnd';

import { ColorModeContext } from '../../../../ColorModeWrapper';
import { GqlFullPlayerFragment } from '../../../../graphql/fragments/__generated__/fullPlayer';
import { PlayerTeam, Team } from '../Team';

export type RanksObject = Record<number, number>;

interface TeamRankProps {
  teams: PlayerTeam[];
  rank: number;
  onDropTeam: (team: PlayerTeam) => void;
  onDropPlayerOnTeam: (
    team: number,
  ) => (player: Pick<GqlFullPlayerFragment, 'id' | 'name'>) => void;
  getHighestTeam: () => number;
  teamRanks: RanksObject;
  getPlayerObjectsFromTeam: (team: number) => Pick<GqlFullPlayerFragment, 'id' | 'name'>[];
}

export const TeamRank: VFC<TeamRankProps> = ({
  teams,
  rank,
  onDropTeam,
  onDropPlayerOnTeam,
  getHighestTeam,
  teamRanks,
  getPlayerObjectsFromTeam,
}) => {
  const [{ isOver, hoveredItem }, drop] = useDrop({
    accept: 'team',
    drop: onDropTeam,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      hoveredItem: monitor.getItem(),
    }),
  });

  const { colorMode } = useContext(ColorModeContext);

  let backgroundColor = colorMode === 'light' ? '#f5f5f5' : '#242424';
  if (isOver) {
    backgroundColor = colorMode === 'light' ? '#dddddd' : '#3a3a3a';
  }

  return (
    <Box>
      {rank === 0 ? (
        <Typography>verfügbare Teams</Typography>
      ) : (
        <Typography variant={'h6'}>{`${rank}. Platz`}</Typography>
      )}
      <Paper
        ref={drop}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          padding: 1,
          minHeight: 48,
          backgroundColor,
        }}
      >
        {rank === 0 &&
          Array.from(Array(getHighestTeam() + 2).keys())
            .filter(
              (teamId) =>
                teamId !== 0 && (teamRanks[teamId] === 0 || teamRanks[teamId] === undefined),
            )
            .map((teamId) => (
              <Team
                key={teamId}
                id={teamId}
                onDropPlayer={onDropPlayerOnTeam(teamId)}
                players={getPlayerObjectsFromTeam(teamId)}
              />
            ))}
        {rank !== 0 &&
          teams.map(({ id, players }) => (
            <Team key={id} id={id} onDropPlayer={onDropPlayerOnTeam(id)} players={players} />
          ))}
        {hoveredItem && isOver && !teams.find(({ id }) => hoveredItem.id === id) && (
          <Team
            key={hoveredItem.id}
            id={hoveredItem.id}
            onDropPlayer={onDropPlayerOnTeam(hoveredItem.id)}
            players={hoveredItem.players}
          />
        )}
      </Paper>
    </Box>
  );
};
