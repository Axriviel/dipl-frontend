import { IModelSettingsGA } from "./ModelSettingsGA";
import { IModelSettingsNNI } from "./ModelSettingsNNI";
import { RandomConfig } from "./RandomConfigModels";

export interface IModelSettings{
    opt_algorithm: string,
    optimizer: string,
    optimizerRandom?: RandomConfig;
    loss: string,
    model_name: string,
    metrics: string[],
    monitor_metric: string,
    epochs: number,
    epochsRandom?: RandomConfig,
    batch_size: number,
    batch_sizeRandom?: RandomConfig,
    max_models: number,
    es_threshold: number,
    NNI: IModelSettingsNNI,
    GA: IModelSettingsGA
}