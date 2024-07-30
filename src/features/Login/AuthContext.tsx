// AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user?: string;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<string | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        if (token) {
            fetchUser();
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                {/*localStorage.setItem('token', data.access_token);
                console.log(localStorage.getItem('token'))
                */}
                setIsAuthenticated(true);
                await fetchUser();
                alert("Successfuly logged in")
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(undefined);
                alert("Successfuly logged out")
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/user', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.username);
            } else {
                throw new Error('Failed to fetch user');
            }
        } catch (error) {
            console.error(error);
            setUser(undefined);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
