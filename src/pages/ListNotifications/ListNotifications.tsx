// src/components/NotificationList.tsx
import React, { useEffect } from 'react';
import "./ListNotifications.css";
import { useNotification } from '../../features/Notifications/NotificationsContext';

export const ListNotifications: React.FC = () => {
    const { notifications, setHasNewNotification, currentPage, setCurrentPage, totalPages, setLimit } = useNotification();

    useEffect(() => {
        setHasNewNotification(false);
    }, [setHasNewNotification])

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1); // Přejít na další stránku
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1); // Přejít na předchozí stránku
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(event.target.value)); // Změní limit na hodnotu zvolené v selectu
        setCurrentPage(1); // Vrátí se na první stránku při změně limitu
    };

    return (
        <div className='m-2'>
            {/* Volba počtu notifikací na stránku */}
            <label htmlFor="limit-select">Notifications per page:</label>
            <select id="limit-select" onChange={handleLimitChange}>
                <option value="2">2</option>
                <option value="5" selected>5</option>
                <option value="10">10</option>
            </select>

            <div className='d-flex flex-column align-items-center overflow-auto'>
                <h1>Notifications</h1>
                <ul>
                    {notifications
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())  // Seřadí od nejnovější po nejstarší
                        .map(notification => (

                            <li key={notification.id} className={`notification m-2 ${!notification.was_read?"notification-read":"notification-unread"}`}>
                                <p>{notification.message}</p>
                                <small>{new Date(notification.timestamp).toLocaleString()}</small>
                                <p>Read: {notification.was_read ? "Yes" : "No"}</p>
                                <p>User: {notification.user}</p>
                            </li>

                        ))}
                </ul>
            </div>

            {/* Ovládací prvky pro stránkování */}
            <div className="m-2">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>


        </div>
    );
};