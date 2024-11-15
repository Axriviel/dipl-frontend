import { RandomConfig } from "../LayerConfig";
import { LayerParams } from "./LayerParams";

export interface IDropoutLayer extends LayerParams {
    rate: number,
    rateRandom?: RandomConfig,
}