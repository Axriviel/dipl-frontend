import { ILSTM } from "../../Models/LSTM";

let layerCounter = 0;

export const createLSTMLayer = (): ILSTM => {
    layerCounter++;
    return {
        id: Date.now().toString(),
        name: `lstm_${layerCounter}`,
        type: 'LSTM',
        units: 64,
        unitsRandom: undefined,
        activation: 'tanh',
        activationRandom: undefined,
        recurrentActivation: 'sigmoid',
        returnSequences: false,
        inputs: []
    };
};
