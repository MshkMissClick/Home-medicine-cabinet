import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Notification } from '../../types';
import { parseISO, format } from 'date-fns';

interface NotificationItemProps {
    notification: Notification;
    onDelete: (id: number) => void;
}

const NotificationItem = ({ notification, onDelete }: NotificationItemProps) => {
    console.log('Notification:', notification); // Для отладки
    const formattedDate = notification.date
        ? format(parseISO(notification.date), 'dd.MM.yyyy HH:mm:ss')
        : 'Дата неизвестна';

    return (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ flexGrow: 1 }}>
                {notification.text} ({formattedDate})
            </Typography>
            <IconButton onClick={() => onDelete(notification.id)}>
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

export default NotificationItem;