import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { INotification } from '../../features/Notifications/models/Notification';
import { useAuth } from '../../features/AuthContext/AuthContext';
import { configData } from '../../config/config';

interface NotificationContextType {
    notifications: INotification[];
    hasNewNotification: boolean;
    fetchNotifications: () => void;
    setHasNewNotification: React.Dispatch<React.SetStateAction<boolean>>;  // Přímo předáváme setter
    totalPages: number; // Celkový počet stránek
    currentPage: number; // Aktuální stránka
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // Setter pro stránku
    setLimit: React.Dispatch<React.SetStateAction<number>>; // Setter pro stránku

}

// Typ pro props NotificationProvider, který obsahuje children
interface NotificationProviderProps {
    children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Aktuální stránka
    const [totalPages, setTotalPages] = useState(1); // Celkový počet stránek
    const [limit, setLimit] = useState(5); // Počet notifikací na stránku

    const fetchNotifications = () => {
        if (user && isAuthenticated) {
            fetch(`${configData.API_URL}/notifications?user=${user.id}&page=${currentPage}&limit=${limit}`, {
                method: "GET",
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    const hasUnreadNotifications = data.notifications.some((n: INotification) => !n.was_read);
                    setHasNewNotification(hasUnreadNotifications)
                    // if (notifications.length < data.notifications.length) {
                    // setHasNewNotification(true);
                    // }
                    setNotifications(data.notifications);
                    setTotalPages(data.totalPages); // Nastavení celkového počtu stránek
                })
                .catch(error => {
                    console.error("Error fetching notifications:", error);
                });
        }
    };
    useEffect(() => {
        if (user) {
            // První načtení notifikací
            fetchNotifications();
            console.log("fetch notifikací proveden " + new Date().toLocaleString());

            // Periodické dotazování každých 60 sekund
            const interval = setInterval(() => {
                fetchNotifications();
                console.log("fetch notifikací proveden " + new Date().toLocaleString());

            }, 60000); // 60 sekund

            return () => clearInterval(interval);
        }
    }, [user, currentPage, limit]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            hasNewNotification,
            fetchNotifications,
            setHasNewNotification,
            totalPages,
            currentPage,
            setCurrentPage,
            setLimit
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
