// src/components/FeedbackForm.tsx
import React, { useState } from "react";
import { FeedbackData } from "../../features/Feedback/models/FeedbackData";
import { SendFeedback } from "../../features/Feedback/SendFeedback";
import { useAuth } from "../../features/AuthContext/AuthContext";

export const FeedbackPage = () => {
    const [feedback, setFeedback] = useState<string>("");
    const { user } = useAuth();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data: FeedbackData = { feedback, user };
        console.log(data)


        try {
            await SendFeedback(data);
            //console.log("Feedback successfully sent");
        } catch (error) {
            console.error("Error sending feedback:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="user">User:</label>
                <input
                    disabled
                    type="text"
                    id="user"
                    value={user}
                    required
                />
            </div>
            <div>
                <label htmlFor="feedback">Feedback:</label>
                <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                ></textarea>
            </div>
            <button type="submit">Send</button>
        </form>
    );
};

