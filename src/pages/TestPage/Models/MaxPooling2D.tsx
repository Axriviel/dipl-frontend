import { LayerParams } from "./LayerParams";

export interface IMaxPooling2D extends LayerParams {
    pool_size: number[],
}