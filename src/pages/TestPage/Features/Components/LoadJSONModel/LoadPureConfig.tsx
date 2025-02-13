import { IModelParams } from "../../../Models/ModelParams";

export const loadPureConfig = (file: File, setModelParams: (params: IModelParams) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target?.result as string);

            if (!jsonData.creation_config || !Array.isArray(jsonData.creation_config)) {
                console.error("Invalid JSON structure: Missing creation_config");
                return;
            }

            const [layers, settings, datasetConfig] = jsonData.creation_config;

            setModelParams({
                layers,
                settings,
                datasetConfig,
            });

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };

    reader.readAsText(file);
};
