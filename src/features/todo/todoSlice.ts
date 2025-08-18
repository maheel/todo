import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TodoState, Todo } from "../../types";

const initialState: TodoState = {
  todos: [],
};

export const fetchTodos = createAsyncThunk<Todo[]>(
  "todo/fetchTodos",
  async () => {
    const res = await fetch("http://localhost:4000/api/todos");
    const data = await res.json();
    return data.map((todo: any) => ({
      id: todo._id,
      text: todo.text,
      completed: todo.completed,
    }));
  }
);

export const createTodo = createAsyncThunk<Todo, string>(
  "todo/createTodo",
  async (text) => {
    const res = await fetch("http://localhost:4000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const todo = await res.json();
    return { id: todo._id, text: todo.text, completed: todo.completed };
  }
);

export const toggleTodoAPI = createAsyncThunk<Todo, string | number, { state: { todo: TodoState } }>(
  "todo/toggleTodoAPI",
  async (id, { getState }) => {
    const todo = getState().todo.todos.find((t) => t.id === id);
    if (!todo) throw new Error("Todo not found");
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const updated = await res.json();
    return { id: updated._id, text: updated.text, completed: updated.completed };
  }
);

export const removeTodoAPI = createAsyncThunk<string | number, string | number>(
  "todo/removeTodoAPI",
  async (id) => {
    await fetch(`http://localhost:4000/api/todos/${id}`, { method: "DELETE" });
    return id;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<string | number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string | number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })
      .addCase(toggleTodoAPI.fulfilled, (state, action) => {
        const idx = state.todos.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.todos[idx] = action.payload;
      })
      .addCase(removeTodoAPI.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      });
  },
});

export const { addTodo, removeTodo, toggleTodo, setTodos } = todoSlice.actions;
export default todoSlice.reducer;
