import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";
import TodoList from "./TodoList";

const renderWithRedux = (component: React.ReactElement) => {
  const store = configureStore({ reducer: { todo: todoReducer } });
  return render(<Provider store={store}>{component}</Provider>);
};

describe("TodoList Component", () => {
  test("renders input field and add button", () => {
    renderWithRedux(<TodoList />);
    expect(screen.getByPlaceholderText("Enter a task...")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  test("adds a todo", () => {
    renderWithRedux(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a task...");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(button);

    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  test("toggles todo completion", () => {
    renderWithRedux(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a task...");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(button);

    const completeButton = screen.getByText("Complete");
    fireEvent.click(completeButton);

    expect(screen.getByText("Test Task")).toHaveStyle("text-decoration: line-through");
  });

  test("removes a todo", () => {
    renderWithRedux(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a task...");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Delete Me" } });
    fireEvent.click(button);

    const deleteButton = screen.getByText("❌");
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
  });
});
