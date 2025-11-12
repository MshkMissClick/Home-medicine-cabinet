import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store'; // Изменено: useAppDispatch
import { fetchNotifications, deleteNotification } from '../../store/notificationSlice';
import NotificationItem from './NotificationItem';
import { Box, Typography } from '@mui/material';

interface NotificationPopoverProps {
    onClose: () => void;
}

const NotificationPopover = ({ onClose }: NotificationPopoverProps) => {
    const dispatch = useAppDispatch(); // Изменено: useAppDispatch
    const notifications = useSelector((state: RootState) => state.notifications.items);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <Box sx={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
                <Typography sx={{ p: 2 }}>Нет уведомлений</Typography>
            ) : (
                notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDelete={(id) => dispatch(deleteNotification(id))}
                    />
                ))
            )}
        </Box>
    );
};

export default NotificationPopover;