import { IGeneratorLayer } from "../../Models/GeneratorLayers";

let layerCounter = 0;

export const createGeneratorLayer = (customParams: Partial<IGeneratorLayer> = {}): IGeneratorLayer => {
    layerCounter++;
    const defaultParams: IGeneratorLayer = {
        id: Date.now().toString(),
        name: `generator_${layerCounter}`,
        type: 'Generator',
        size: 1,
        firstLayer: 0,
        firstLayerRandom: undefined,
        sizeRandom: undefined,
        possibleLayers: [],
        inputs: [],
    };

    return { ...defaultParams, ...customParams };
};