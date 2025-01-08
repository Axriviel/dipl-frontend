import { IFlattenLayer } from "../../Models/FlattenLayer";

let layerCounter = 0;

export const createFlattenLayer = (): IFlattenLayer => {
    layerCounter++;
    return {
        id: Date.now().toString(),
        name: `Flatten_${layerCounter}`,
        type: 'Flatten',
        inputs: []
    };
};
