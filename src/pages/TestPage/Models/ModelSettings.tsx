import { IModelSettingsGA } from "./ModelSettingsGA";
import { IModelSettingsNNI } from "./ModelSettingsNNI";

export interface IModelSettings{
    opt_algorithm: string,
    optimizer: string,
    loss: string,
    metrics: string[],
    monitor_metric: string,
    epochs: number,
    batch_size: number,
    max_models: number,
    es_threshold: number,
    NNI: IModelSettingsNNI,
    GA: IModelSettingsGA
}