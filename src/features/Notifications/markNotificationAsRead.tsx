import { configData } from "../../config/config";

export const markNotificationAsRead = async (notificationId: number) => {
    try {
        const response = await fetch(`${configData.API_URL}/notifications/${notificationId}/mark-as-read`, {
            method: 'PUT',
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to mark notification as read: ${response.statusText}`);
        }

        return { success: true, message: 'Notification marked as read.' };
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return { success: false, message: (error as Error).message };
    }
};
