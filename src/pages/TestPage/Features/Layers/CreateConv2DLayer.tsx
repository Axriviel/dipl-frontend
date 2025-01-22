import { IConv2DLayer } from "../../Models/Conv2DLayer";

let layerCounter = 0;

export const createConv2DLayer = (customParams: Partial<IConv2DLayer> = {}): IConv2DLayer => {
  layerCounter++;
  const defaultParams: IConv2DLayer = {
    id: Date.now().toString(),
    name: `conv2d_${layerCounter}`,
    type: 'Conv2D',
    filters: 64,
    filtersRandom: undefined,
    kernel_size: [3, 3],
    activation: 'relu',
    inputs: []
  };

  return { ...defaultParams, ...customParams };
};
