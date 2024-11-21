import { IDenseLayer } from "../../Models/DenseLayer";

// to provide unique name which is required by Keras in case of concatenate
let layerCounter = 0;

export const createDenseLayer = (customParams: Partial<IDenseLayer> = {}): IDenseLayer => {
  layerCounter++;
  console.log(`Creating dense layer ${layerCounter}`); // Pro kontrolu hodnot
    const defaultParams: IDenseLayer = {
    id: Date.now().toString(),
    name: `dense_${layerCounter}`,
    type: 'Dense',
    units: 32,
    unitsRandom: undefined,
    activation: 'relu',
    activationRandom: undefined,
    inputs: []
  };

  return { ...defaultParams, ...customParams };
};
