import { configData } from "../../config/config";

export const GetModels = async () => {
    try {
        const response = await fetch(`${configData.API_URL}/api/getmodels`, {
            method: 'GET',
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch models:', error);
        return { success: false, message: (error as Error).message };
    }
};
