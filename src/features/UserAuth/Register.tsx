import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Button, Form } from 'react-bootstrap';
import { useAlert } from '../../components/Alerts/AlertContext';
import { API_KEY, configData } from '../../config/config';

export const Register: React.FC = () => {
    const { addAlert } = useAlert();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${configData.API_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-API-KEY": API_KEY
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
        <Form onSubmit={handleSubmit} className="p-3">
            <h2>Register</h2>

            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit" className="my-2">
                Register
            </Button>
        </Form>
    );
};