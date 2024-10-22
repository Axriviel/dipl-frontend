import { LayerParams } from "../../Models/LayerParams";

// to provide unique name which is required by Keras in case of concatenate
let layerCounter = 0;

export const createDenseLayer = (): LayerParams => {
  layerCounter++;
  return {
    id: Date.now().toString(),
    name: `dense_${layerCounter}`,
    type: 'Dense',
    units: 32,
    unitsRandom: undefined,
    activation: 'relu',
    activationRandom: undefined,
    inputs: []
  };
};
