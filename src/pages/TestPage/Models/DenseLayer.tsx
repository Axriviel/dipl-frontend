import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface IDenseLayer extends LayerParams {
    units?: number;
    unitsRandom?: RandomConfig;
    activation?: string;
    activationRandom?: RandomConfig;
}