import { createDenseLayer } from "../Layers/CreateDenseLayer";
import { createInputLayer } from "../Layers/CreateInputLayer";

export const IndiansPreset = async (setModelParams: Function, setSelectedDataset: Function) => {
    setModelParams({
        layers: [
            createInputLayer({ id: "1732203259530" }),
            createDenseLayer({
                id: "1732203259531",
                units: 1,
                activation: "sigmoid",
                inputs: ["1732203259530"],
            }),
        ],
        settings: {
            opt_algorithm: "random",
            optimizer: "adam",
            loss: "binary_crossentropy",
            metrics: ["accuracy"],
            monitor_metric: "val_accuracy",
            epochs: 10,
            batch_size: 32,
            max_models: 5,
            NNI: {
                nni_concurrency: 1,
                nni_max_trials: 5,
                nni_tuner: "Evolution",
            },
            GA: {
                generations: 5,
                populationSize: 5,
                numParents: 2,
                mutationRate: 0.3,
                selectionMethod: "Tournament",
            },
        },
        datasetConfig: {
            x_columns: [],
            x_num: 8,
            y_column: "",
            y_num: 9,
            test_size: 0.2,
        },
    });

    try {
        // const response = await fetch("/pima-indians-diabetes.csv");
        // const blob = await response.blob();
        // const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
        setSelectedDataset("pima-indians-diabetes.csv");
    } catch (error) {
        console.error("Chyba při načítání souboru:", error);
    }
};
