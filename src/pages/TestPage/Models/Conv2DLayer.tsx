import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface IConv2DLayer extends LayerParams {
    filters?: number;
    filtersRandom?: RandomConfig;
    kernel_size?: number[];
}