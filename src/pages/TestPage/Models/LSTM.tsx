import { LayerParams } from "./LayerParams";
import { RandomConfig } from "./RandomConfigModels";

export interface ILSTM extends LayerParams {
    units: number,
    unitsRandom?: RandomConfig,
    activation?: string;
    activationRandom?: RandomConfig;
    recurrentActivation?: string,
    returnSequences: boolean,
}