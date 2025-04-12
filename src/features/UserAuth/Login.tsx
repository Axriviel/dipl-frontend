import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await login(username, password);
        if(result){
            navigate("/")
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3">
            <h2>Login</h2>

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

            <Button variant="primary" type="submit" className='my-2'>
                Login
            </Button>
        </Form>
    );
};

