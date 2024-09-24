import { useAuth } from '../../features/AuthContext/AuthContext';

export const ProfilePage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className='d-flex flex-column align-items-center'>
            <h2>User Profile</h2>
            <p>Id: {user?.id}</p>
            <p>Username: {user?.username}</p>
        </div>
    );
};

