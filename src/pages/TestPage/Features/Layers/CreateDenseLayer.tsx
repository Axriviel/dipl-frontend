import { LayerParams } from "../../Models/LayerParams";

export const createDenseLayer = (): LayerParams => ({
  id: Date.now().toString(),
  name: "dense",
  type: 'Dense',
  units: 32,
  unitsRandom: undefined,
  activation: 'relu',
  activationRandom: undefined,
  inputs: []
});
