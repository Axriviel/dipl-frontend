import React from 'react';
import { useAuth } from '../../features/Login/AuthContext';

const Logout: React.FC = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
