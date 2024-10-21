import { IGeneratorLayer } from "../../Models/GeneratorLayers";

export const createGeneratorLayer = (): IGeneratorLayer => ({
    id: Date.now().toString(),
    name: "generator",
    type: 'Generator',
    possibleLayers: [],
    inputs: [],
})