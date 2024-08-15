import React, { useState } from 'react';
import { useAuth } from '../../../features/Login/AuthContext';
import { Button } from 'react-bootstrap';
import { useAlert } from '../../../components/Alerts/AlertContext';
import { configData } from '../../../config/config';

export const Register: React.FC = () => {
    const { addAlert } = useAlert();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${configData.API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (response.ok) {
                await login(username, password);
                addAlert("Successfuly registered", "success")
                //alert("Successfuly registered")
            } else {
                addAlert("Registration failed", "error")
                console.error('Registration failed');
            }
        } catch (error) {
            addAlert(error + "", "error");
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <label>
                Username:
                <input type="text" className='mx-2' value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" className='mx-2' value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <Button type="submit" className='my-2'>Register</Button>
        </form>
    );
};