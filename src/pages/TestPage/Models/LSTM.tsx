import { RandomConfig } from "../LayerConfig";
import { LayerParams } from "./LayerParams";

export interface ILSTM extends LayerParams {
    units: number,
    unitsRandom?: RandomConfig,
    activation?: string;
    activationRandom?: RandomConfig;
    recurrentActivation?: string,
    returnSequences: boolean,
}