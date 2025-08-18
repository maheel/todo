import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../state/store";
import { addNotification, markAllAsRead, setNotifications } from "../features/notificationSlice";
import { Notification } from "../types";
import { io, Socket } from "socket.io-client";
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationBell: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Fetch notifications from API on mount
  useEffect(() => {
    fetch("http://localhost:4000/api/notifications")
      .then(res => res.json())
      .then(data => {
        dispatch(setNotifications(data));
      });
  }, [dispatch]);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    socketRef.current.on("notification", (notification: Notification) => {
      dispatch(addNotification(notification));
    });
    socketRef.current.on("notifications", (notifs: Notification[]) => {
      dispatch(setNotifications(notifs));
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [dispatch]);

  const handleBellClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    if (unreadCount > 0) {
      await fetch("http://localhost:4000/api/notifications/markAllAsRead", { method: "PATCH" });
      dispatch(markAllAsRead());
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleBellClick} size="large">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { minWidth: 280, maxWidth: 350 } }}
      >
        <Typography variant="h6" sx={{ p: 2, pb: 1 }}>Notifications</Typography>
        <List sx={{ maxHeight: 300, overflowY: 'auto', p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem sx={{ color: '#888', py: 2, justifyContent: 'center' }}>No notifications</ListItem>
          ) : (
            notifications.map((n) => (
              <ListItem key={n._id || n.id} sx={{ background: n.read ? '#f9f9f9' : '#e6f7ff', borderBottom: '1px solid #eee', py: 2 }}>
                <Typography variant="body2">{n.message}</Typography>
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell;
