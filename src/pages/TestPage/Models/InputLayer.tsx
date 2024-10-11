import { LayerParams } from "./LayerParams";

export interface IInputLayer extends LayerParams {
    shape: number[];
    batch_size?: number;
    dtype?: string;
    sparse?: boolean;
}