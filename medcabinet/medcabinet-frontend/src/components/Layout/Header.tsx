import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, IconButton, Popover, Button, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { RootState, useAppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import { fetchNotifications } from '../../store/notificationSlice';
import NotificationPopover from '../Notifications/NotificationPopover';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const dispatch = useAppDispatch();
    const notificationsCount = useSelector((state: RootState) => state.notifications.items.length);

    // Загружаем уведомления при монтировании и каждые 10 секунд
    useEffect(() => {
        // Первоначальная загрузка
        dispatch(fetchNotifications());

        // Периодический опрос каждые 10 секунд
        const interval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 10000); // 3\10 секунд

        // Очистка интервала при размонтировании
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    MedCabinet
                </Typography>
                <IconButton color="inherit" onClick={handleClick}>
                    <Badge
                        variant="dot"
                        color="error"
                        invisible={notificationsCount === 0}
                    >
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Button color="inherit" onClick={() => dispatch(logout())}>
                    Выйти
                </Button>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <NotificationPopover onClose={handleClose} />
                </Popover>
            </Toolbar>
        </AppBar>
    );
};

export default Header;