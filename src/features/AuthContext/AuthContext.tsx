import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAlert } from '../../components/Alerts/AlertContext';
import { API_KEY, configData } from '../../config/config';
import { IUser } from './models/User';

interface AuthContextType {
    isAuthenticated: boolean;
    user?: IUser;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        const checkUser = async () => {
            try {
                await fetchUser();  // Pokud fetchUser uspěje, nastavíme uživatele jako přihlášeného
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);  // Pokud fetchUser selže, nastavíme uživatele jako odhlášeného
            }
        };

        checkUser();
    }, []);

    useEffect(() => {
        console.log(isAuthenticated)
    }, [isAuthenticated]);


    const { addAlert } = useAlert();

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${configData.API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-API-KEY": API_KEY
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (response.ok) {
                // const data = await response.json();
                // localStorage.setItem('token', data.access_token); // Uložení tokenu do localStorage
                // console.log(localStorage.getItem("token"))
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
            const response = await fetch(`${configData.API_URL}/api/user/logout`, {
                method: 'DELETE',
                credentials: 'include',
                // body: JSON.stringify({ user_uuid: localStorage.getItem("token") }),
            });

            if (response.ok) {
                // localStorage.removeItem('token'); // Odebrání tokenu z localStorage
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
            console.log("trying fetch")
            const response = await fetch(`${configData.API_URL}/api/user/getUser`, {
                method: 'GET',
                credentials: 'include',  // Odesílá session cookie
            });

            if (!response.ok) {
                throw new Error('Server responded, but failed to fetch user' + response.status);
            }
            else {
                const data = await response.json();
                setUser({ id: data.id, username: data.username });
            }
        } catch (error) {
            // Detekce síťových chyb (kdy server není dostupný)
            if (error instanceof TypeError) {
                console.error("Network error: Backend may not be available", error);
            } else {
                console.error("Error fetching user:", error);
            }

            // Nastavení uživatele jako odhlášeného
            setUser(undefined);
            setIsAuthenticated(false);
            throw error
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
