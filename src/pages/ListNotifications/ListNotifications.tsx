// src/components/NotificationList.tsx
import React, { useEffect, useState } from 'react';
import "./ListNotifications.css";
import { useNotification } from '../../features/Notifications/NotificationsContext';
import { markNotificationAsRead } from '../../features/Notifications/markNotificationAsRead';
import { useAlert } from '../../components/Alerts/AlertContext';

export const ListNotifications: React.FC = () => {
    const { notifications, setHasNewNotification, currentPage, setCurrentPage, totalPages, setLimit, fetchNotifications } = useNotification();
    const [isHovered, setIsHovered] = useState<number>(-1)
    const { addAlert } = useAlert()

    useEffect(() => {
        setHasNewNotification(false);
    }, [setHasNewNotification])

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1); 
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1); 
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(event.target.value)); 
        setCurrentPage(1); 
    };

    const handleMarkAsRead = async (notificationId: number, notificationWasRead: boolean) => {
        if (notificationWasRead === false) {
            const result = await markNotificationAsRead(notificationId);

            if (result.success) {
                addAlert(result.message, "success");
                fetchNotifications();
            } else {
                addAlert(result.message, "error");
            }
        }
        else{
            addAlert("Already marked as read", 'warning')
        }
    };



    return (
        <div className='m-2'>
            {/* Volba počtu notifikací na stránku */}
            <label htmlFor="limit-select">Notifications per page:</label>
            <select id="limit-select" onChange={handleLimitChange} defaultValue={"5"}>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>

            <div className='d-flex flex-column align-items-center overflow-auto'>
                <h1>Notifications</h1>
                <ul className='notifications'>
                    {notifications
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())  // order from newest
                        .map(notification => (

                            <li key={notification.id} onMouseEnter={() => setIsHovered(notification.id)} onMouseLeave={() => setIsHovered(-1)} className={`notification m-4 ${!notification.was_read ? "notification-read" : "notification-unread"}`}>
                                <div className='d-flex flex-column flex-wrap'>
                                    <p className=''>{notification.message}</p>
                                    <small>{new Date(notification.timestamp).toLocaleString()}</small>
                                    {isHovered === notification.id ? <div onClick={() => handleMarkAsRead(notification.id, notification.was_read)} className='mark-as-read'>Mark as read</div> : undefined}
                                </div>
                            </li>

                        ))}
                </ul>
                <div className="my-1">
                    <button onClick={prevPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span className='mx-1'>Page {currentPage} of {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};