import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";
import notificationReducer from "../features/notificationSlice";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    notification: notificationReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
