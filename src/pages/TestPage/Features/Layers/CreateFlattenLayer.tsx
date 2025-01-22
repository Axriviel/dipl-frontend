import { IFlattenLayer } from "../../Models/FlattenLayer";

let layerCounter = 0;

export const createFlattenLayer = (customParams: Partial<IFlattenLayer> = {}): IFlattenLayer => {
    layerCounter++;
    const defaultParams: IFlattenLayer = {
        id: Date.now().toString(),
        name: `Flatten_${layerCounter}`,
        type: 'Flatten',
        inputs: []
    };

    return { ...defaultParams, ...customParams };
};
