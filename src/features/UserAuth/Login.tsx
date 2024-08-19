import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Button } from 'react-bootstrap';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await login(username, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label>
                Username:
                <input type="text" className='mx-2' value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" className="mx-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <Button type="submit" className='my-2'>Login</Button>
        </form>
    );
};

