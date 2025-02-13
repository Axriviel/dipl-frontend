import { createConv2DLayer } from "../Layers/CreateConv2DLayer";
import { createDenseLayer } from "../Layers/CreateDenseLayer";
import { createFlattenLayer } from "../Layers/CreateFlattenLayer";
import { createInputLayer } from "../Layers/CreateInputLayer";

export const Cifar10Preset = async (setModelParams: Function, setSelectedDataset: Function) => {
  setModelParams({
    layers: [
      createInputLayer({ id: "1732203259550", shape: [32, 32, 3] }),
      createConv2DLayer({
        id: "1732203259551",
        filtersRandom: { type: "numeric", min: 1, max: 100, step: 1 },
        activation: "relu",
        inputs: ["1732203259550"],
      }),
      createFlattenLayer({ id: "1732203259552", inputs: ["1732203259551"] }),
      createDenseLayer({
        id: "1732203259553",
        units: 10,
        activation: "softmax",
        inputs: ["1732203259552"],
      }),
    ],
    settings: {
      opt_algorithm: "random",
      optimizer: "adam",
      loss: "binary_crossentropy",
      model_name: "myModel",
      metrics: ["accuracy"],
      monitor_metric: "val_accuracy",
      epochs: 3,
      es_threshold: 0.5,
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
    // const response = await fetch("/cifar10_normalized.npz");
    // const blob = await response.blob();
    // const defaultFile = new File([blob], "cifar10_normalized.npz", { type: blob.type });
    // setFile(defaultFile);
    setSelectedDataset("cifar10_normalized.npz")
  } catch (error) {
    console.error("Error loading file:", error);
  }
};
