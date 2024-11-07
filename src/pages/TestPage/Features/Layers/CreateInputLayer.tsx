import { IInputLayer } from "../../Models/InputLayer";

let layerCounter = 0;

export const createInputLayer = (): IInputLayer => {
    layerCounter++;
    return {
        id: Date.now().toString(),
        name: `input_${layerCounter}`,
        type: 'Input',
        shape: [8],  // Výchozí tvar vstupu (např. obrázek 64x64 s 3 kanály)
        inputs: []
    };
};