import { IInputLayer } from "../../Models/InputLayer";

export const createInputLayer = (): IInputLayer => ({
    id: Date.now().toString(),
    name: "input",
    type: 'Input',
    shape: [32],  // Výchozí tvar vstupu (např. obrázek 64x64 s 3 kanály)
    inputs: []
});