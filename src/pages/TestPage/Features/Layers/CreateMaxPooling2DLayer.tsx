import { IMaxPooling2D } from "../../Models/MaxPooling2D";

let layerCounter = 0;

export const createMaxPooling2DLayer = (): IMaxPooling2D => {
    layerCounter++;
    return {
        id: Date.now().toString(),
        name: `maxpooling2d_${layerCounter}`,
        type: 'MaxPooling2D',
        pool_size: [2, 2],
        inputs: []
    };
};
