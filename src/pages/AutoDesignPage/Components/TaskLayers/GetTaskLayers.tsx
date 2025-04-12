import { createBatchNormLayer } from "../../../TestPage/Features/Layers/CreateBatchNormLayer";
import { createConv2DLayer } from "../../../TestPage/Features/Layers/CreateConv2DLayer";
import { createDenseLayer } from "../../../TestPage/Features/Layers/CreateDenseLayer";
import { createDropoutLayer } from "../../../TestPage/Features/Layers/CreateDropoutLayer";
import { createFlattenLayer } from "../../../TestPage/Features/Layers/CreateFlattenLayer";
import { createGeneratorLayer } from "../../../TestPage/Features/Layers/CreateGeneratorLayer";
import { createInputLayer } from "../../../TestPage/Features/Layers/CreateInputLayer";

// tohle by asi bylo nejlepší ty returny vyházet do samostatných souborů a tady volat danou komponentu pro každý case
// function to return setup based on generator task
export const GetTaskLayers = (taskType: String) => {
    switch (taskType) {
        case "binary classification":
            return [
                // input layer, shape is set automaticaly on BE, this is just some default value
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
                createInputLayer({ id: "11111" }),

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
                createDenseLayer({
                    id: "dense_2",
                    units: 2,
                    activation: "softmax",
                    inputs: ["22222"],
                }),
            ];

        case "image multiclass classification":
            return [
                createInputLayer({ id: "1111", shape: [32, 32, 3] }),

                createGeneratorLayer({
                    id: "22222",
                    // how big can the model get, min 1 hidden layer and max 10
                    sizeRandom: { "type": "numeric", "min": 1, "max": 10, "step": 1 },
                    possibleLayers: [
                        createDenseLayer({
                            id: "1",
                            unitsRandom: { type: "numeric", min: 1, max: 100, step: 1 },
                            inputs: ["1", "2"],
                        }),
                        createConv2DLayer({
                            id: "2",
                            filtersRandom: { type: "numeric", min: 1, max: 100, step: 1 },
                            inputs: ["1", "2"]
                        })
                    ],
                    inputs: ["1111"]
                }),
                createFlattenLayer({ id: "3333", inputs: ["22222"] }),
                createDenseLayer({
                    id: "dense_3",
                    units: 10,
                    activation: "softmax",
                    inputs: ["3333"],
                }),
            ];
        case "regression":
            return [
                // input layer, shape is set on backend, this is just some default value
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
                            inputs: ["1", "2", "3"],
                        }),
                        createDropoutLayer({
                            id: "2",
                            inputs: ["1", "2"],
                        }),
                        createBatchNormLayer({
                            id: "3",
                            inputs: ["1", "2"],
                        }),
                    ],
                    inputs: ["11111"]
                }),
                // output layer
                createDenseLayer({
                    inputs: ["22222"],
                    units: 1,
                    activation: "linear"
                })
            ];

        default:
            return []; // Vracení prázdného pole pro neznámé typy
    }
};
