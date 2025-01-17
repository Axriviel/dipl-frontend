import { createDenseLayer } from "../../../TestPage/Features/Layers/CreateDenseLayer";
import { createGeneratorLayer } from "../../../TestPage/Features/Layers/CreateGeneratorLayer";
import { createInputLayer } from "../../../TestPage/Features/Layers/CreateInputLayer";

// tohle by asi bylo nejlepší ty returny vyházet do samostatných souborů a tady volat danou komponentu pro každý case
// function to return setup based on generator task
export const GetTaskLayers = (taskType: String) => {
    switch (taskType) {
        case "binary classification":
            return [
                // input layer, shape is set in the form, this is just some default value
                createInputLayer({ id: "11111", shape: [8] }),

                // definition of generator layer
                createGeneratorLayer({
                    id: "22222",
                    // how big can the model get, min 1 hidden layer and max 10
                    sizeRandom: { "type": "numeric", "min": 1, "max": 10, "step": 1 },
                    possibleLayers: [
                        createDenseLayer({
                            id: "1",
                            unitsRandom: { type: "numeric", min: 1, max: 100, step: 1 },
                            inputs: ["1"],
                        }),
                    ],
                    inputs: ["11111"]
                }),
                // output layer
                createDenseLayer({
                    inputs: ["22222"],
                    units: 1,
                    activation: "sigmoid"
                })
            ];

        case "multiclass classification":
            return [
                createInputLayer({ id: "input_2" }),
                createDenseLayer({
                    id: "dense_2",
                    units: 1,
                    activation: "linear",
                    inputs: ["input_2"],
                }),
            ];

        case "image multiclass classification":
            return [
                createInputLayer({ id: "input_3" }),
                createDenseLayer({
                    id: "dense_3",
                    units: 10,
                    activation: "relu",
                    inputs: ["input_3"],
                }),
            ];

        default:
            return []; // Vracení prázdného pole pro neznámé typy
    }
};
