export interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
}

export interface Notification {
  _id?: string;
  id?: number;
  message: string;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
}
