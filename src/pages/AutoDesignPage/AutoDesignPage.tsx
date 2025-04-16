import Tippy from "@tippyjs/react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { TaskInfoOverlay } from "../../components/TaskInfoOverlay/TaskInfoOverlay";
import { autoTaskTypes, configData, maximumDepthMax, maximumDepthMin } from "../../config/config";
import { TagsForm } from "../../features/TagsForm";
import { HelpfulTip } from "../../features/Tooltip";
import { GetUserDatasets } from "../../features/UserDatasets/GetDatasets";
import { DatasetConfigModal } from "../TestPage/Features/Dataset/DatasetConfigModal";
import "./AutoDesignPage.css";
import { AutoModelConfigForm } from "./Components/Forms/AutoModelConfigFormModal";
import { GetTaskLayers } from "./Components/TaskLayers/GetTaskLayers";
import { IAutoTaskState } from "./Models/AutoTask";
import { IModelAutoSettings } from "./Models/ModelAutoSettings";


export const AutoDesignPage = () => {
    const [autoTask, setAutoTask] = useState<IAutoTaskState>({
        taskType: "binary classification",
        layers: [],
        maxModels: 20,
        settings: {
            opt_algorithm: "random",
            optimizer: 'Adam',
            optimizerRandom: undefined,
            loss: 'binary_crossentropy',
            limit_growth: "square",
            model_name: "",
            k_fold: 1,
            metrics: ['accuracy'],
            monitor_metric: "accuracy",
            epochs: 10,
            epochsRandom: undefined,
            use_timeout: false,
            timeout: 0,
            batch_size: 32,
            batch_sizeRandom: undefined,
            max_models: 5,
            es_threshold: 0.4,
            NNI: {
                nni_concurrency: 1,
                nni_max_trials: 5,
                nni_tuner: "Evolution"
            },
            GA: {
                generations: 5,
                populationSize: 5,
                numParents: 2,
                mutationRate: 0.3,
                selectionMethod: "Tournament"
            }
        },
        datasetConfig: {
            x_columns: [],
            x_num: 0,
            y_columns: [],
            one_hot_x_columns: [],
            one_hot_y_columns: [],
            encode_y: false,
            y_num: 0,
            test_size: 0.2,
        }
    });
    const [tags, setTags] = useState<string[]>([])


    const [datasets, setDatasets] = useState<string[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [useDefaultDataset, setUseDefaultDataset] = useState<boolean>(true)
    const { addAlert } = useAlert();
    const [isTaskOverlayOpen, setTaskInfoOverlay] = useState<boolean>(false);

    // Load datasets
    useEffect(() => {
        GetUserDatasets()
            .then((data) => setDatasets(data.datasets))
            .catch((error) => console.error("Error fetching datasets:", error));
    }, []);

    // load default on first load
    useEffect(() => {
        const layers = GetTaskLayers("binary classification");
        setAutoTask(prevTask => ({
            ...prevTask,
            layers
        }));
    }, []);

    const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDataset(e.target.value);
        setUseDefaultDataset(false)
    };


    const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setAutoTask((prevTask) => {
            const updatedTask: IAutoTaskState = {
                ...prevTask,
                [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
            };

            if (name === "taskType") {
                const updatedDatasetConfig = {
                    ...prevTask.datasetConfig,
                    encode_y: value === "multiclass classification"
                };

                const updatedSettings = getSettingsForTaskType(value, prevTask.settings);
                const updatedLayers = GetTaskLayers(value);

                return {
                    ...updatedTask,
                    datasetConfig: updatedDatasetConfig,
                    settings: updatedSettings,
                    layers: updatedLayers,
                };
            }

            return updatedTask;
        });
    };




    // change key and value in specific layer
    // const handleLayerUnitsChange = (key: string, layer: number, value: number | string) => {
    //     setAutoTask((prevState) => {
    //         const layers = [...prevState.layers];
    //         layers[layer] = {
    //             ...layers[layer],
    //             [key]: value,
    //         };
    //         return { ...prevState, layers };
    //     });
    // };

    const handleMaxDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Number(e.target.value);
        if (newMax >= maximumDepthMin && newMax <= maximumDepthMax) {
            const updatedLayers = autoTask.layers.map(layer => {
                if (layer.type === "Generator") {
                    return {
                        ...layer,
                        sizeRandom: {
                            ...layer.sizeRandom,
                            max: newMax
                        }
                    };
                }
                return layer;
            });

            setAutoTask({
                ...autoTask,
                layers: updatedLayers
            })
        }
        else {
            addAlert(`Max depth must be between ${maximumDepthMin} and ${maximumDepthMax}`, "warning")
        }
    };


    // might be used again at some point for dynamic changes based on selection

    // const handlePresetFileChange = (selectedTaskType: string) => {
    // setAutoTask((prevAutoTask) => {
    //     let updatedDatasetConfig = {
    //         ...prevAutoTask.datasetConfig,
    //         encode_y: selectedTaskType === "multiclass classification"
    //     };

    //     const updatedSettings = getSettingsForTaskType(selectedTaskType, prevAutoTask.settings);
    //     console.log(updatedSettings);

    //     // let updatedLayers = prevAutoTask.layers;

    //     // if (selectedTaskType === "multiclass classification") {
    //     //     // updatedLayers = GetTaskLayers("multiclass classification");
    //     // } else if (selectedTaskType === "binary classification") {
    //     //     // updatedLayers = GetTaskLayers("binary classification");
    //     // } else if (selectedTaskType === "image multiclass classification") {
    //     //     // updatedLayers = GetTaskLayers("image multiclass classification");
    //     // }

    //     return {
    //         ...prevAutoTask,
    //         // setAutoTaskSettings()
    //         // taskType: selectedTaskType,
    //         settings: updatedSettings,
    //         datasetConfig: updatedDatasetConfig,
    //         // layers: updatedLayers
    //     };
    // });
    // };

    const getSettingsForTaskType = (taskType: string, prevSettings: IModelAutoSettings) => {
        switch (taskType) {
            case "binary classification":
                return {
                    ...prevSettings,
                    loss: "binary_crossentropy",
                    optimizer: "Adam",
                    opt_algorithm: "random",
                    limit_growth: "square"

                };
            case "multiclass classification":
                return {
                    ...prevSettings,
                    loss: "categorical_crossentropy",
                    optimizer: "Adam",
                    opt_algorithm: "random",
                    limit_growth: "square"
                };
            case "image multiclass classification":
                return {
                    ...prevSettings,
                    loss: "categorical_crossentropy",
                    optimizer: "Adam",
                    opt_algorithm: "random",
                    use_timeout: true,
                    timeout: 600, // default 10 minutes
                    limit_growth: "square"
                };
            case "regression":
                return {
                    ...prevSettings,
                    loss: "mean_squared_error",
                    optimizer: "Adam",
                    opt_algorithm: "random",
                };
            default:
                return prevSettings;
        }
    };

    const isInputCorrect = () => {
        if (!selectedDataset) {
            addAlert("Please select a dataset before submitting", "warning");
            return false;
        }
        if (autoTask.datasetConfig.x_columns.length === 0 || autoTask.datasetConfig.y_columns.length === 0) {
            addAlert("You need to specify data in dataset config", "warning")
            return false;
        }
        if ((autoTask.taskType === "multiclass classification") && autoTask.layers[2]?.units <= 1) {
            addAlert("Number of classes cannot be less or equal than one", "warning")
            return false
        }
        if ((autoTask.taskType === "image multiclass classification") && autoTask.layers[3]?.units <= 1) {
            addAlert("Number of classes cannot be less or equal than one", "warning")
            return false
        }
        return true
    }

    const handleSubmit = () => {
        if (!isInputCorrect()) {
            return
        }

        console.log(JSON.stringify(autoTask.layers));
        console.log(JSON.stringify(autoTask.settings));
        console.log(JSON.stringify(autoTask.datasetConfig));
        console.log("Selected dataset:", selectedDataset);

        const updatedTags = {
            "task": autoTask.taskType,
            "dataset": selectedDataset,
            "metric": autoTask.settings.monitor_metric,
            "userTags": tags,
        };
        console.log(JSON.stringify(updatedTags));

        const formData = new FormData();
        formData.append("datasetFile", selectedDataset);
        formData.append("useDefaultDataset", useDefaultDataset ? "true" : "false");
        formData.append("taskType", autoTask.taskType);
        formData.append("layers", JSON.stringify(autoTask.layers));
        formData.append("settings", JSON.stringify(autoTask.settings));
        formData.append("datasetConfig", JSON.stringify(autoTask.datasetConfig));
        formData.append("maxModels", JSON.stringify(autoTask.maxModels));
        formData.append("tags", JSON.stringify(updatedTags));

        addAlert("Task sent to server", "info");
        let isMounted = true;

        fetch(`${configData.API_URL}/api/models/save-auto-model`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(
                            errorData.error || `HTTP error! Status: ${response.status}`
                        );
                    });
                }
                return response.json();
            })
            .then((result) => {
                if (isMounted) {
                    console.log("Model successfully sent to backend:", result);
                    addAlert(result.message, "success");
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error("Error sending model to backend:", error);
                    addAlert(error.message || "Unexpected error occurred", "error");
                }
            });

        return () => {
            isMounted = false;
        };
    };



    // moved mostly to BE, currently unused
    // const renderMethodSpecificFields = () => {
    //     switch (autoTask.taskType) {
    //         case 'image multiclass classification':
    //             return (
    //                 <>
    //                     {/* <Form.Label>Output classes:</Form.Label>
    //                     <DebouncedNumberInput
    //                         value={autoTask.layers[3]?.units}
    //                         onChange={(value: number) =>
    //                             handleLayerUnitsChange('units', 3, value)
    //                         }
    //                         timeout={500}
    //                         placeholder="Enter number of classes"
    //                         step={1}
    //                     /> */}
    //                 </>
    //             );
    //         case 'multiclass classification':
    //             return (
    //                 <>
    //                     {/* <Form.Label>Output classes:</Form.Label>
    //                     <DebouncedNumberInput
    //                         value={autoTask.layers[2]?.units}
    //                         onChange={(value: number) =>
    //                             handleLayerUnitsChange('units', 2, value)
    //                         }
    //                         timeout={500}
    //                         placeholder="Enter number of classes"
    //                         step={1}
    //                     /> */}
    //                 </>
    //             );

    //         default:
    //             return null;
    //     }
    // };

    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const [showDatasetSettingsModal, setShowDatasetSettingsModal] = useState<boolean>(false);

    const handleOpenSettingsModal = () => setShowSettingsModal(true);
    const handleCloseSettingsModal = () => setShowSettingsModal(false);


    const handleOpenDatasetSettingsModal = () => setShowDatasetSettingsModal(true);
    const handleCloseDatasetModal = () => setShowDatasetSettingsModal(false);

    return (
        <div className="d-flex flex-column align-items-center">
            <h2 className="p-2">Model Configuration</h2>
            <Form.Group>
                <Form.Label>Select Dataset:</Form.Label>
                <Form.Select
                    className="cursor-pointer"
                    value={selectedDataset}
                    onChange={handleDatasetChange}
                >
                    <option value="">-- Select a dataset --</option>
                    {datasets.map((dataset, index) => (
                        <option key={index} value={dataset}>
                            {dataset}
                        </option>
                    ))}
                </Form.Select>


                <Form.Label>Task type:</Form.Label>
                <Form.Select
                    name="taskType"
                    value={autoTask.taskType || ''}
                    onChange={handleInputChange}
                >
                    {autoTaskTypes.map(tt => (
                        <option key={tt} value={tt}>{tt}</option>
                    ))}
                </Form.Select>

                <div className='d-flex flex-row justify-content-center flex-wrap mt-2'>
                    <Tippy content="Dataset specific settings">
                        <Button className='m-1' onClick={handleOpenDatasetSettingsModal}> Dataset Config</Button>
                    </Tippy>
                    <Tippy content="Model specific settings">
                        <Button className='m-1' onClick={handleOpenSettingsModal}> Model Settings</Button>
                    </Tippy>
                </div>

                <DatasetConfigModal
                    datasetName={selectedDataset}
                    datasetParams={autoTask.datasetConfig}
                    setDatasetConfig={(value) => setAutoTask(value as IAutoTaskState)}
                    show={showDatasetSettingsModal}
                    handleClose={handleCloseDatasetModal} />

                <AutoModelConfigForm
                    modelParams={autoTask}
                    setModelParams={setAutoTask}
                    show={showSettingsModal}
                    handleClose={handleCloseSettingsModal}
                />

                <Form.Group controlId="maxDepth">
                    <Form.Label>
                        Max depth{' '}
                        <HelpfulTip text={`Defines the maximum amount of hidden layers. Must be between ${maximumDepthMin} and ${maximumDepthMax}`} />
                    </Form.Label>
                    <Form.Control
                        type="number"
                        name="maxDepth"
                        value={
                            autoTask.layers.find(layer => layer.type === "Generator")?.sizeRandom?.max ?? ''
                        }
                        onChange={handleMaxDepthChange}
                    />
                </Form.Group>

                <TagsForm tags={tags} setTags={setTags} />
            </Form.Group>


            {/* <Button className="m-2" onClick={() => console.log(tags)}>Submit Tags</Button> */}
            <Tippy placement="bottom" content="Sends the task to backend. You will be notified about the result when finished">
                <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>
            </Tippy>
            <Button variant="secondary" className="m-2" onClick={() => setTaskInfoOverlay(!isTaskOverlayOpen)}>Status</Button>
            {isTaskOverlayOpen && <TaskInfoOverlay />}
        </div>
    )
}
