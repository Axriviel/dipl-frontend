// src/components/FeedbackList.tsx
import React, { useState, useEffect } from 'react';
import { Feedback } from '../../features/Feedback/models/Feedback';
import { configData } from '../../config/config';

export const ListFeedback = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        // Fetch data from the Flask backend
        fetch(`${configData.API_URL}/getfeedback`)
            .then(response => response.json())
            .then(data => {
                setFeedbacks(data);
            })
            .catch(error => {
                console.error("Error fetching feedback:", error);
            });
    }, []);

    return (
        <div>
            <h1>Feedback List</h1>
            <ul>
                {feedbacks.map(feedback => (
                    <li key={feedback.id}>
                        <p>{feedback.feedback}</p>
                        <small>{new Date(feedback.timestamp).toLocaleString()}</small>
                        <p>User: {feedback.user} </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

