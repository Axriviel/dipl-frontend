import { IDatasetConfig } from "./DatasetConfig";
import { LayerParams } from "./LayerParams";
import { IModelSettings } from "./ModelSettings";

export interface IModelParams {
  layers: LayerParams[];
  settings: IModelSettings;
  datasetConfig: IDatasetConfig;
}