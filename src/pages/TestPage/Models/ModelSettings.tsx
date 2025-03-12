import { RandomConfig } from "../LayerConfig";
import { IModelSettingsGA } from "./ModelSettingsGA";
import { IModelSettingsNNI } from "./ModelSettingsNNI";

export interface IModelSettings{
    opt_algorithm: string,
    optimizer: string,
    loss: string,
    model_name: string,
    metrics: string[],
    monitor_metric: string,
    epochs: number,
    batch_size: number,
    batch_sizeRandom?: RandomConfig,
    max_models: number,
    es_threshold: number,
    NNI: IModelSettingsNNI,
    GA: IModelSettingsGA
}