import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface IDropoutLayer extends LayerParams {
    rate: number,
    rateRandom?: RandomConfig,
}