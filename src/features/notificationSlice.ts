import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, Notification } from '../types';

const initialNotificationState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialNotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  }
});

export const { addNotification, markAsRead, markAllAsRead, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
