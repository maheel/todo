import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TodoState, Todo } from "../../types";

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:4000";

type ApiTodo = {
  _id: string;
  text: string;
  completed: boolean;
};

const mapApiTodo = (t: ApiTodo): Todo => ({
  id: t._id,
  text: t.text,
  completed: Boolean(t.completed),
});

async function apiFetch<T>(
  path: string,
  init: RequestInit & { signal?: AbortSignal } = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

const initialState: TodoState = {
  todos: [],
};

export const fetchTodos = createAsyncThunk<Todo[]>(
  "todo/fetchTodos",
  async (_arg, thunkAPI) => {
    const data = await apiFetch<ApiTodo[]>("/api/todos", { signal: thunkAPI.signal });
    return data.map(mapApiTodo);
  }
);

export const createTodo = createAsyncThunk<Todo, string>(
  "todo/createTodo",
  async (text, thunkAPI) => {
    const todo = await apiFetch<ApiTodo>("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: thunkAPI.signal,
    });
    return mapApiTodo(todo);
  }
);

export const toggleTodoAPI = createAsyncThunk<
  Todo,
  string | number,
  { state: { todo: TodoState } }
>("todo/toggleTodoAPI", async (id, { getState, signal }) => {
  const current = getState().todo.todos.find((t) => String(t.id) === String(id));
  if (!current) throw new Error("Todo not found");

  const updated = await apiFetch<ApiTodo>(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !current.completed }),
    signal,
  });
  return mapApiTodo(updated);
});

export const removeTodoAPI = createAsyncThunk<string | number, string | number>(
  "todo/removeTodoAPI",
  async (id, thunkAPI) => {
    await apiFetch<void>(`/api/todos/${id}`, {
      method: "DELETE",
      signal: thunkAPI.signal,
    });
    return id;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload);
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
