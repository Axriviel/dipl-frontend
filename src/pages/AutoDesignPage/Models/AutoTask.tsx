import { IDatasetConfig } from "../../TestPage/Models/DatasetConfig";
import { LayerParams } from "../../TestPage/Models/LayerParams";
import { IModelAutoSettings } from "./ModelAutoSettings";

export interface IAutoTaskState {
    taskType: string;
    // optMethod: string;
    layers: LayerParams[];
    settings: IModelAutoSettings;
    datasetConfig: IDatasetConfig;
    maxModels: number;
}