import { configData } from "../../config/config";
import { IUserDataset } from "./Models/UserDataset";

export const GetUserDatasets = async (): Promise<IUserDataset> => {
    try {
        const response = await fetch(`${configData.API_URL}/api/dataset/list-datasets`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Chyba při načítání datasetů: ${errorData.error}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user datasets:", error);
        return { datasets: [] };
    }
};
