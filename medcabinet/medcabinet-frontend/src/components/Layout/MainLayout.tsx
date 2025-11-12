import { Box } from '@mui/material';
import Header from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <Box>
            <Header />
            <Box sx={{ p: 3 }}>{children}</Box>
        </Box>
    );
};

export default MainLayout;