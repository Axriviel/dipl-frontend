import { IConv2DLayer } from "../../Models/Conv2dLayer";

let layerCounter = 0;

export const createConv2DLayer = (): IConv2DLayer => {
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
