// src/components/FeedbackForm.tsx
import React, { useState } from "react";
import { FeedbackData } from "../../features/Feedback/models/FeedbackData";
import { SendFeedback } from "../../features/Feedback/SendFeedback";
import { useAuth } from "../../features/AuthContext/AuthContext";
import { useAlert } from "../../components/Alerts/AlertContext";
import { Button, Form } from "react-bootstrap";
import "./FeedbackPage.css"
import { DebouncedTextArea } from "../../components/FormElements/DebouncedTextArea";

export const FeedbackPage = () => {
    const [feedback, setFeedback] = useState<string>("");
    const { user } = useAuth();
    const { addAlert } = useAlert();
    const [isSent, setIsSent] = useState<boolean>(false);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data: FeedbackData = { feedback, user: user?.username };
        console.log(data)


        try {
            await SendFeedback(data);
            //console.log("Feedback successfully sent");
            setIsSent(true);
            addAlert("Feedback successfuly sent", "success");
        } catch (error) {
            addAlert("" + error, "error");
            console.error("Error sending feedback:", error);
        }
    };

    return (
        <div className="feedback-container mx-auto my-5 p-5 d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-75">
                <Form.Label><h2 className="">Provide feedback</h2></Form.Label>
                <Form.Group className="mb-3 w-100" controlId="user">
                    <Form.Label>User:</Form.Label>
                    <Form.Control
                        type="text"
                        value={user?.username}
                        disabled
                        required
                        className="w-50"
                    />
                </Form.Group>

                <Form.Group className="mb-3 w-100" controlId="feedback">
                    <Form.Label>Feedback:</Form.Label>

                    <DebouncedTextArea value={feedback} disabled={isSent} className="w-100"
                        onChange={(value: string) => setFeedback(value)} // Callback, když se změna potvrzuje po debounce
                    />
                    {/* <Form.Control
                        as="textarea"
                        value={feedback}
                        onChange={(e) => { setFeedback(e.target.value); console.log(feedback) }}
                        disabled={isSent ? true : false}
                        required
                        className="w-100"
                    /> */}
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSent}>
                    Send
                </Button>
            </Form>
        </div>
    );
};

