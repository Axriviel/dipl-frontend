import { IBatchNormalizationLayer } from "../../Models/BatchNormLayer";

let layerCounter = 0;

export const createBatchNormLayer = (customParams: Partial<IBatchNormalizationLayer> = {}): IBatchNormalizationLayer => {
    layerCounter++;
    const defaultParams: IBatchNormalizationLayer = {
        id: Date.now().toString(),
        name: `batch_norm_${layerCounter}`,
        type: "BatchNormalization",
        momentumRandom: undefined,
        momentum: 0.99,
        epsilonRandom: undefined,
        epsilon: 1e-5,
        axis: -1,
        center: true,
        scale: true,
        inputs: []
    };

    return { ...defaultParams, ...customParams };
};
