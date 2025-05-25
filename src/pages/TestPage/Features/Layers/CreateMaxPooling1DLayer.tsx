import { IMaxPooling1DLayer } from "../../Models/MaxPooling1D";

let layerCounter = 0;

export const createMaxPooling1DLayer = (customParams: Partial<IMaxPooling1DLayer> = {}): IMaxPooling1DLayer => {
    layerCounter++;
    const defaultParams: IMaxPooling1DLayer = {
        id: Date.now().toString(),
        name: `maxpool1d_${layerCounter}`,
        type: 'MaxPooling1D',
        pool_size: 2,
        strides: 2,
        padding: 'valid',
        inputs: [],
    };

    return { ...defaultParams, ...customParams };
};
