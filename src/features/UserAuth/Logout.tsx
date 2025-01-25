import React from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Button } from 'react-bootstrap';

const Logout: React.FC = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className='d-flex justify-content-center'>
            <Button onClick={handleLogout} className='my-2'>Logout</Button>
        </div>
    );
};

export default Logout;
