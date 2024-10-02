import { configData } from "../../config/config";

export const DeleteModel = async (modelId: number) => {
    try {
        const response = await fetch(`${configData.API_URL}/api/delete-model/${modelId}`, {
            method: 'DELETE',
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to delete the model: ${response.statusText}`);
        }

        return { success: true, message: 'Model successfully deleted' };
    } catch (error) {
        console.error('Failed to delete the model:', error);
        return { success: false, message: (error as Error).message }; 
    }
};