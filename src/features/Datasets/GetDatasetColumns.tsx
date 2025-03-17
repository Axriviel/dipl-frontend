import { configData } from "../../config/config";

export const getDatasetColumns = async (datasetName: string, isDefaultDataset: boolean = false) => {
    try {
        const response = await fetch(`${configData.API_URL}/api/dataset/get_column_names`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_name: datasetName, is_default_dataset: isDefaultDataset }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error}`);
        }

        const data = await response.json();

        if (!data.columns) {
            throw new Error("Invalid response format: missing 'columns' field");
        }

        return data.columns; // Vrací pouze seznam sloupců
    } catch (error) {
        console.error("Error fetching column names:", error);
        return null; // Vrátíme null při chybě, aby frontend nepadal
    }
};
