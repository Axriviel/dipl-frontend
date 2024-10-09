import { LayerParams } from "../../Models/LayerParams";

export const createConv2DLayer = (): LayerParams => ({
  id: Date.now().toString(),
  name: "conv2d",
  type: 'Conv2D',
  filters: 64,
  filtersRandom: undefined,
  kernel_size: [3, 3],
  activation: 'relu',
  inputs: []
});
