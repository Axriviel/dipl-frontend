import { IModelSettingsGA } from "./ModelSettingsGA";
import { IModelSettingsNNI } from "./ModelSettingsNNI";
import { RandomConfig } from "./RandomConfigModels";

export interface IModelSettings {
    opt_algorithm: string,
    optimizer: string,
    optimizerRandom?: RandomConfig;
    loss: string,
    limit_growth : string,
    k_fold: number
    model_name: string,
    metrics: string[],
    monitor_metric: string,
    epochs: number,
    epochsRandom?: RandomConfig,
    batch_size: number,
    batch_sizeRandom?: RandomConfig,
    max_models: number,
    use_timeout: boolean,
    timeout?: number,
    es_patience: number,
    es_delta: number,
    es_threshold: number,
    NNI: IModelSettingsNNI,
    GA: IModelSettingsGA
}