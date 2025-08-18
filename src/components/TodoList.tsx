import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../state/store";
import { fetchTodos, createTodo, toggleTodoAPI, removeTodoAPI } from "../features/todo/todoSlice";
import { Todo } from "../types";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';

const TodoList: React.FC = () => {
  const [input, setInput] = useState("");
  const todos = useSelector((state: RootState) => state.todo.todos);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAdd = async () => {
    if (input.trim()) {
      await dispatch(createTodo(input));
      setInput("");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>To-Do List</Typography>
        <form onSubmit={e => { e.preventDefault(); handleAdd(); }} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter a task..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit">Add</Button>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell align="center">Completed</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo: Todo) => (
                <TableRow key={todo.id}>
                  <TableCell sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => dispatch(toggleTodoAPI(todo.id))}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => dispatch(toggleTodoAPI(todo.id))} color={todo.completed ? "secondary" : "success"}>
                      {todo.completed ? <UndoIcon /> : <CheckIcon />}
                    </IconButton>
                    <IconButton onClick={() => dispatch(removeTodoAPI(todo.id))} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default TodoList;
