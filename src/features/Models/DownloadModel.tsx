export const DownloadModel = async (modelId: number) => {
    try {
        const response = await fetch(`http://localhost:5000/api/download-model/${modelId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Failed to download the model: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Vytvoření URL z blobu
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `model_${modelId}.keras`); // Název souboru
        document.body.appendChild(link);
        link.click();

        // Odstranění odkazu
        link.parentNode?.removeChild(link);
    } catch (error) {
        console.error('Failed to download the model:', error);
    }
};
