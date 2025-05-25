import { IConv1DLayer } from "../../Models/Conv1DLayer";

let layerCounter = 0;

export const createConv1DLayer = (customParams: Partial<IConv1DLayer> = {}): IConv1DLayer => {
    layerCounter++;
    const defaultParams: IConv1DLayer = {
        id: Date.now().toString(),
        name: `conv1d_${layerCounter}`,
        type: 'Conv1D',
        filters: 64,
        filtersRandom: undefined,
        kernel_size: 3,
        kernel_sizeRandom: undefined,
        strides: 1,
        stridesRandom: undefined,
        padding: 'valid',
        paddingRandom: undefined,
        activation: 'relu',
        activationRandom: undefined,
        inputs: [],
    };

    return { ...defaultParams, ...customParams };
};
