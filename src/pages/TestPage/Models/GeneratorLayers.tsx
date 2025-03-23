import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface IGeneratorLayer extends LayerParams{
    size: number,
    firstLayer: number,
    firstLayerRandom?: RandomConfig,
    sizeRandom?: RandomConfig,
    possibleLayers: Array<LayerParams>,
}