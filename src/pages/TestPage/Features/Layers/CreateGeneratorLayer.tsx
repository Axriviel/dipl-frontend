import { IGeneratorLayer } from "../../Models/GeneratorLayers";

let layerCounter = 0;

export const createGeneratorLayer = (): IGeneratorLayer => {
    layerCounter++;
    return {
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
};