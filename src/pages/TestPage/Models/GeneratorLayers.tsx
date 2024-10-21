import { LayerParams } from "./LayerParams";

export interface IGeneratorLayer extends LayerParams{
    possibleLayers: Array<LayerParams>
}