export const configData = { API_URL: "http://localhost:5000" }
// export const configData = { API_URL: "https://backend.axriviel.eu" }

export const API_KEY = "ASF4561.AF545wagdA56fds89911a2vaASF32!"


// tasks that are supported in Auto designer section
export const autoTaskTypes = ["binary classification", "multiclass classification", "image multiclass classification", "regression"]

// options for Model Configuration form
//optimization algorithm options for custom designer
export const optAlgorithmOptions = ["random", "genetic", "bayesian", "nni"];

//optimization algorithm options for auto designer
export const optAlgorithmAutoOptions = ["random", "genetic", "bayesian", "tagging"];

//Keras model optimizers
export const optimizerOptions = [
    'SGD', 'RMSprop', 'Adam', 'AdamW', 'Adadelta',
    'Adagrad', 'Adamax', 'Adafactor', 'Nadam',
    'Ftrl', 'Lion'
];

//Keras loss function options
export const lossFunctionOptions = [
    "binary_crossentropy", "categorical_crossentropy", "sparse_categorical_crossentropy", "mean_squared_error",
]
export const growthFunctionOptions = [
    "none", "linear", "log", "square",
]

//Keras available monitor metrics
export const availableMonitorMetrics = [
    'accuracy', 'val_accuracy', 'precision', 'val_precision',
    'recall', 'val_recall', 'AUC', 'val_AUC', 'mean_squared_error', 'val_mean_squared_error'
];

//Keras available metrics
export const availableMetrics = [
    'accuracy', 'precision', 'recall', 'f1-score', 'AUC', 'mean_squared_error'
];

//Automated designer maximum number of layers in generator Max and Min define the interval in which user can set the number
export const maximumDepthMax = 15
export const maximumDepthMin = 1