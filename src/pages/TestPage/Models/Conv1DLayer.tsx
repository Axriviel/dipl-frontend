import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface IConv1DLayer extends LayerParams {
    filters?: number;
    filtersRandom?: RandomConfig;
    kernel_size?: number;
    kernel_sizeRandom?: RandomConfig;
    strides?: number;
    stridesRandom?: RandomConfig;
    padding?: string;
    paddingRandom?: RandomConfig;
    activation?: string;
    activationRandom?: RandomConfig;
}
