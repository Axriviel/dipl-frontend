import { RandomConfig } from "../LayerConfig";
import { LayerParams } from "./LayerParams";

export interface IConv2DLayer extends LayerParams {
    filters?: number;
    filtersRandom?: RandomConfig;
    kernel_size?: number[];
}