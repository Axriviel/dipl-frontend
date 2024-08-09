import React, { useEffect } from 'react';
import { useAuth } from '../../features/Login/AuthContext';

export const ProfilePage: React.FC = () => {
    const { user, fetchUser, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchUser();
        }
    }, [isAuthenticated, fetchUser]);

    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className='d-flex flex-column align-items-center'>
            <h2>User Profile</h2>
            <p>Username: {user}</p>
        </div>
    );
};

