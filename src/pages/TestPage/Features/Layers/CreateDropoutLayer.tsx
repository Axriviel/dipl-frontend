import { IDropoutLayer } from "../../Models/DropoutLayer";

let layerCounter = 0;

export const createDropoutLayer = (customParams: Partial<IDropoutLayer> = {}): IDropoutLayer => {
  layerCounter++;
  const defaultParams: IDropoutLayer = {
    id: Date.now().toString(),
    name: `dropout_${layerCounter}`,
    type: 'Dropout',
    rateRandom: undefined,
    rate: 0.5,
    inputs: []
  };

  return { ...defaultParams, ...customParams };
};
