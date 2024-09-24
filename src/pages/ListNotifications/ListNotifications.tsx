// src/components/NotificationList.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';
import { INotification } from '../../features/Notifications/models/Notification';
import "./ListNotifications.css"

export const ListNotifications: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const location = useLocation(); // Získání aktuální cesty

    useEffect(() => {
        if (user === undefined) {
            console.error("User is not authenticated or username is missing");
            return;
        }
        else {
            // Fetch data from the Flask backend
            fetch(`http://localhost:5000/notifications?user=${encodeURIComponent(user.id)}`)
                .then(response => response.json())
                .then(data => {
                    setNotifications(data);
                    console.log(data)
                })
                .catch(error => {
                    console.error("Error fetching notifications:", error);
                });
        }
    }, [user, location.pathname]); //update notifications list

    return (
        <div>
            <h1>Notifications for {user?.username}</h1>
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