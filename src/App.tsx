import React from "react";
import TodoList from "./components/TodoList";
import NotificationBell from "./components/NotificationBell";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

const App: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <NotificationBell />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <TodoList />
      </Container>
    </Box>
  );
};

export default App;
