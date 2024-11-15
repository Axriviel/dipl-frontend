import { RandomConfig } from "../LayerConfig";
import { LayerParams } from "./LayerParams";

export interface IDenseLayer extends LayerParams {
    units?: number;
    unitsRandom?: RandomConfig;
    activation?: string;
    activationRandom?: RandomConfig;
}