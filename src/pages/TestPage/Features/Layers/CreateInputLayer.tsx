import { IInputLayer } from "../../Models/InputLayer";

let layerCounter = 0;

export const createInputLayer = (customParams: Partial<IInputLayer> = {}): IInputLayer => {
    layerCounter++;
    const defaultParams: IInputLayer = {
        id: Date.now().toString(),
        name: `input_${layerCounter}`,
        type: 'Input',
        shape: [8], // Výchozí tvar vstupu
        inputs: []
    };

    return { ...defaultParams, ...customParams };
};