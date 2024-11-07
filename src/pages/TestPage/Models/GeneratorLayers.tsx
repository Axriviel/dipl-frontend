import { RandomConfig } from "../LayerConfig";
import { LayerParams } from "./LayerParams";

export interface IGeneratorLayer extends LayerParams{
    size: number,
    firstLayer: number,
    firstLayerRandom?: RandomConfig,
    sizeRandom?: RandomConfig,
    possibleLayers: Array<LayerParams>,
}