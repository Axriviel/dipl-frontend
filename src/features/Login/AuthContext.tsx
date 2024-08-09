import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAlert } from '../../components/Alerts/AlertContext';

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
        if (token) {
            setIsAuthenticated(true);
            fetchUser();
        }
    }, []);

    const { addAlert } = useAlert();

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
                localStorage.setItem('token', data.access_token); // Uložení tokenu do localStorage
                setIsAuthenticated(true);
                await fetchUser();
                addAlert('Successfully logged in!', 'success');
                //alert("Successfully logged in");
            } else {
                addAlert('Login failed!', 'error'); // 
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error(error);
            addAlert(error + "", 'error');
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
                localStorage.removeItem('token'); // Odebrání tokenu z localStorage
                setIsAuthenticated(false);
                setUser(undefined);
                addAlert('Successfully logged out!', 'success');
                //alert("Successfully logged out");
            } else {
                addAlert('Logout failed', "error");
                throw new Error('Logout failed');
            }
        } catch (error) {
            addAlert(error + "", "error");
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
            //something went wrong and we were unable to fetch user - user is now logged out
            console.error(error);
            addAlert(error + "fetchUser", "error");
            addAlert("Automaticaly logged out due to an error", 'info')
            setUser(undefined);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
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
