export const DeleteModel = async (modelId: number) => {
    try {
        const response = await fetch(`http://localhost:5000/api/delete-model/${modelId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete the model: ${response.statusText}`);
        }

        alert('Model successfully deleted',);
        return true;
    } catch (error) {
        console.error('Failed to delete the model:', error);
        alert('Failed to delete the model');
    }
};