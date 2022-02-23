import { useApolloClient } from '@apollo/client';
import styled from '@emotion/styled';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { VFC } from 'react';

import { useDeleteMatchMutation } from '../../../graphql/mutations/__generated__/deleteMatch';
import { useMatchesQuery } from '../../../graphql/queries/__generated__/matches';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InnerTable = styled.table`
  width: 100%;
`;

export const MatchHistory: VFC = () => {
  const { data } = useMatchesQuery();
  const [deleteMatch] = useDeleteMatchMutation();
  const apolloClient = useApolloClient();

  const deleteLastMatch = async () => {
    if (data) {
      if (window.confirm('Letztes Match wirklich löschen?')) {
        await deleteMatch({ variables: { id: data.matches[0].id } });
        await apolloClient.refetchQueries({
          include: 'active',
        });
      }
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 1,
        backgroundColor: (theme) => theme.palette.background.paper,
        gridColumn: '1',
        gridRow: 2,
      }}
    >
      <Header>
        <Typography variant="h4" mb={2}>
          Matchverlauf
        </Typography>
        <Button onClick={deleteLastMatch} sx={{ marginBottom: '6px' }}>
          letztes Match löschen
        </Button>
      </Header>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Spiel</TableCell>
              <TableCell>Uhrzeit</TableCell>
              <TableCell>Teilnehmer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.matches.map(({ id, createdAt, eloInfo, game }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {game.name}
                </TableCell>
                <TableCell>{format(new Date(createdAt), 'hh:mm:ss')}</TableCell>
                <TableCell sx={{ padding: 0, '& tr:last-child td': { border: 'none' } }}>
                  <InnerTable>
                    <tbody>
                      {eloInfo.map(({ player: { name }, eloChange, rank }) => (
                        <TableRow sx={{ display: 'flex' }}>
                          <TableCell align="right">{rank}.</TableCell>
                          <TableCell>{name}</TableCell>
                          <TableCell sx={{ flexGrow: 1 }}>{eloChange}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </InnerTable>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
