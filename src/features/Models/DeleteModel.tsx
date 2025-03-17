import { configData } from "../../config/config";

export const DeleteModel = async (modelId: number) => {
    try {
        const response = await fetch(`${configData.API_URL}/api/delete-model/${modelId}`, {
            method: 'DELETE',
            credentials: "include",
        });

        const data = await response.json(); // Načtení odpovědi jako JSON

        return {
            success: response.ok,
            message: data.message || "Unknown error",
            status: response.status, // Vracíme status kód pro frontend
        };
    } catch (error) {
        console.error('Failed to delete the model:', error);
        return {
            success: false,
            message: "Server error. Please try again later.",
            status: 500, // Pokud je to síťová chyba, považujeme to za 500
        };
    }
};
