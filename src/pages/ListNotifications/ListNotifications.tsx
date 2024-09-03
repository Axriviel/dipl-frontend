// src/components/NotificationList.tsx
import React, { useState, useEffect } from 'react';
import { Notification } from '../../features/Notifications/models/Notification';
import { useAuth } from '../../features/AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';

export const ListNotifications: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const location = useLocation(); // Získání aktuální cesty

    useEffect(() => {
        if (user === undefined) {
            console.error("User is not authenticated or username is missing");
            return;
        }
        else {
            // Fetch data from the Flask backend
            fetch(`http://localhost:5000/notifications?user=${encodeURIComponent(user)}`)
                .then(response => response.json())
                .then(data => {
                    setNotifications(data);
                })
                .catch(error => {
                    console.error("Error fetching notifications:", error);
                });
        }
    }, [user, location.pathname]); // Aktualizace při změně user

    return (
        <div>
            <h1>Notifications for {user}</h1>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.timestamp).toLocaleString()}</small>
                        <p>Read: {notification.was_read ? "Yes" : "No"}</p>
                        <p>User: {notification.user}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};