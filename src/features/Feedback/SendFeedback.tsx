import { configData } from "../../config/config";
import { FeedbackData } from "./models/FeedbackData";

export const SendFeedback = async (data: FeedbackData): Promise<void> => {
    try {
        const response = await fetch(`${configData.API_URL}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Something went wrong.");
        }
        else {
            const responseData = await response.json();
            console.log(responseData.message);

        }

    } catch (error) {
        console.error("Error sending feedback:", error);
        throw error; 
    }
};