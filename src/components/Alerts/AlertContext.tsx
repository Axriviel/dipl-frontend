import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IAlert, AlertType } from './Models/IAlert';


interface AlertContextProps {
    alerts: IAlert[];
    addAlert: (message: string, type: AlertType) => void;
    removeAlert: (id: number) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within a AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<IAlert[]>([]);

    const addAlert = (message: string, type: AlertType) => {
        const newAlert: IAlert = {
            id: Date.now(),
            message,
            type
        };
        setAlerts((prev) => [...prev, newAlert]);
    };

    const removeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
