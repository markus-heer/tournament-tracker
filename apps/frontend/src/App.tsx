import { ApolloProvider } from '@apollo/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { apolloClient } from './graphql/apolloClient';
import { Leaderboard } from './pages/Leaderboard/Leaderboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#181818',
    },
  },
});

const App: React.VFC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Leaderboard />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
