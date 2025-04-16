import { configData } from "../../config/config";

export const DownloadModel = async (modelId: number) => {
    try {
        const response = await fetch(`${configData.API_URL}/api/download-model/${modelId}`, {
            method: 'GET',
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to download the model: ${response.statusText}`);
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `model_${modelId}.keras`); //custom name
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
    } catch (error) {
        console.error('Failed to download the model:', error);
    }
};
