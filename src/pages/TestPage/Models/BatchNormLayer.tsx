import { LayerParams } from "./LayerParams";

export interface IBatchNormalizationLayer extends LayerParams {
    momentum?: number;  // Např. 0.99
    epsilon?: number;   // Např. 1e-5
    axis?: number;      // Např. -1
    center?: boolean;   // true / false
    scale?: boolean;    // true / false
}
