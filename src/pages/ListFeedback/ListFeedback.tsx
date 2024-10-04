// src/components/FeedbackList.tsx
import { useEffect, useState } from 'react';
import { configData } from '../../config/config';
import { Feedback } from '../../features/Feedback/models/Feedback';
import "./ListFeedback.css";

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
        <div className='d-flex flex-column align-items-center'>
            <h1>Feedback List</h1>
            <ul>
                {feedbacks
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Seřazení od nejnovějšího po nejstarší
                    .map(feedback => (
                        <li key={feedback.id} className='m-3 mx-0 p-3 feedback-list-item overflow-auto'>
                            <p>{feedback.feedback}</p>
                            <small>{new Date(feedback.timestamp).toLocaleString()}</small>
                            <p>User: {feedback.user}</p>
                        </li>
                    ))}

            </ul>
        </div>
    );
};

