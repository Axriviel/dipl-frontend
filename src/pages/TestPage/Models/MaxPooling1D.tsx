import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface IMaxPooling1DLayer extends LayerParams {
    pool_size?: number;
    pool_sizeRandom?: RandomConfig;
    strides?: number;
    stridesRandom?: RandomConfig;
    padding?: string;
    paddingRandom?: RandomConfig;
}
