import { useApolloClient } from '@apollo/client';
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

import { AvatarWithName } from '../../components/AvatarWithName';
import { useDeletePlayerMutation } from '../../graphql/mutations/__generated__/deletePlayer';
import { usePlayersQuery } from '../../graphql/queries/__generated__/players';
import { sortByName } from '../../helpers/sortByName';

export const PlayerList = () => {
  const apolloClient = useApolloClient();
  const { data } = usePlayersQuery();
  const [deletePlayer] = useDeletePlayerMutation();

  const confirmAndDeletePlayer = async (id: string, name: string) => {
    if (window.confirm(`Spieler ${name} wirklich löschen?`)) {
      await deletePlayer({ variables: { id } });
      await apolloClient.refetchQueries({
        include: 'active',
      });
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ padding: 1, backgroundColor: (theme) => theme.palette.background.paper }}
    >
      <Typography variant="h4" mb={2}>
        Spieler
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Aktion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...(data?.players || [])].sort(sortByName).map(({ id, name, numberOfMatches }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  <AvatarWithName name={name} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    disabled={numberOfMatches !== 0}
                    onClick={() => {
                      confirmAndDeletePlayer(id, name);
                    }}
                  >
                    löschen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
