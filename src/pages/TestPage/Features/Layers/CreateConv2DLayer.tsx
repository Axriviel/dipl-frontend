import { LayerParams } from "../../Models/LayerParams";

let layerCounter = 0;

export const createConv2DLayer = (): LayerParams => {
  layerCounter++;
  return {
    id: Date.now().toString(),
    name: `conv2d_${layerCounter}`,
    type: 'Conv2D',
    filters: 64,
    filtersRandom: undefined,
    kernel_size: [3, 3],
    activation: 'relu',
    inputs: []
  };
};
