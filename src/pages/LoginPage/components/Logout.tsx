import React from 'react';
import { useAuth } from '../../../features/Login/AuthContext';
import { Button } from 'react-bootstrap';

const Logout: React.FC = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div>
            <Button onClick={handleLogout} className='my-2'>Logout</Button>
        </div>
    );
};

export default Logout;
