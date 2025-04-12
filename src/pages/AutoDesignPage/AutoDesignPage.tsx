import Tippy from "@tippyjs/react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { DebouncedNumberInput } from "../../components/FormElements/DebouncedNumberInput";
import { TaskInfoOverlay } from "../../components/TaskInfoOverlay/TaskInfoOverlay";
import { autoTaskTypes, configData, maximumDepthMax, maximumDepthMin } from "../../config/config";
import { TagsForm } from "../../features/TagsForm";
import { GetUserDatasets } from "../../features/UserDatasets/GetDatasets";
import { DatasetConfigModal } from "../TestPage/Features/Dataset/DatasetConfigModal";
import "./AutoDesignPage.css";
import { AutoModelConfigForm } from "./Components/Forms/AutoModelConfigFormModal";
import { GetTaskLayers } from "./Components/TaskLayers/GetTaskLayers";
import { IAutoTaskState } from "./Models/AutoTask";
import { HelpfulTip } from "../../features/Tooltip";
import { IModelAutoSettings } from "./Models/ModelAutoSettings";


export const AutoDesignPage = () => {
    const [autoTask, setAutoTask] = useState<IAutoTaskState>({
        taskType: "binary classification",
        layers: [],
        maxModels: 20,
        settings: {
            opt_algorithm: "random",
            optimizer: 'Adam',
            loss: 'binary_crossentropy',
            limit_growth: "none",
            model_name: "",
            k_fold: 1,
            metrics: ['accuracy'],
            monitor_metric: "accuracy",
            epochs: 10,
            use_timeout: false,
            timeout: 0,
            batch_size: 32,
            // batch_sizeRandom: {
            //     "max": 100,
            //     "min": 1,
            //     "step": 1,
            //     "type": "numeric"
            // },
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


    // const [useTimer, setUseTimer] = useState<boolean>(false)
    const [datasets, setDatasets] = useState<string[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [useDefaultDataset, setUseDefaultDataset] = useState<boolean>(true)
    const { addAlert } = useAlert();
    const [isTaskOverlayOpen, setTaskInfoOverlay] = useState<boolean>(false);
    // const [tagInput, setTagInput] = useState<string>("");

    // const handleAddTag = () => {
    //     if (tagInput.trim() && !tags.includes(tagInput.trim())) {
    //         setTags([...tags, tagInput.trim()]);
    //         setTagInput("");
    //     }
    // };

    // const handleRemoveTag = (tag: string) => {
    //     setTags(tags.filter(t => t !== tag));
    // };

    // Load datasets
    useEffect(() => {
        GetUserDatasets()
            .then((data) => setDatasets(data.datasets))
            .catch((error) => console.error("Error fetching datasets:", error));
    }, []);

    // Načtení výchozích vrstev při prvním renderu
    useEffect(() => {
        const layers = GetTaskLayers("binary classification");
        setAutoTask(prevTask => ({
            ...prevTask,
            layers
        }));
    }, []); // Prázdné pole závislostí zajistí, že se efekt spustí jen jednou

    // // set default dataset
    // useEffect(() => {
    //     setUseDefaultDataset(true)
    //     setSelectedDataset("pima-indians-diabetes.csv")
    //     // if (file === null) {
    //     //     fetch('/pima-indians-diabetes.csv')
    //     //         .then(response => response.blob())
    //     //         .then(blob => {
    //     //             const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
    //     //             setFile(defaultFile);
    //     //         })
    //     //         .catch(error => console.error("Chyba při načítání souboru:", error));
    //     // }
    // }, []);

    // Zpracování změny výběru datasetu
    const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDataset(e.target.value);
        setUseDefaultDataset(false)
    };

    // const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value, type } = e.target;

    //     setAutoTask((prevTask) => {
    //         const updatedTask = {
    //             ...prevTask,
    //             [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
    //         };

    //         // Pokud se mění taskType, aktualizujte layers
    //         // a nastavení úlohy v settings TBA
    //         if (name === "taskType") {
    //             updatedTask.layers = GetTaskLayers(value);
    //             handlePresetFileChange(value)
    //         }

    //         return updatedTask;
    //     });
    // };
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


    // const handleInputShapeChange = (key: string, value: number[]) => {
    //     setAutoTask((prevState) => {
    //         // Pokud layers ještě nemá žádný prvek, přidáme výchozí vrstvu
    //         const layers = [...prevState.layers];
    //         // Pokud první vrstva existuje, upravíme její hodnotu shape
    //         layers[0] = {
    //             ...layers[0],
    //             [key]: value,
    //         };
    //         return { ...prevState, layers };
    //     });
    // };

    // change key and value in specific layer
    const handleLayerUnitsChange = (key: string, layer: number, value: number | string) => {
        setAutoTask((prevState) => {
            const layers = [...prevState.layers];
            layers[layer] = {
                ...layers[layer],
                [key]: value,
            };
            return { ...prevState, layers };
        });
    };

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


    // const handleDebouncedNumberChange = useCallback((key: keyof IAutoTaskState) => {
    //     return (value: number) => {
    //         console.log(value)
    //         setAutoTask((prev) => ({
    //             ...prev,
    //             [key]: value,
    //         }));
    //     };
    // }, []);

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         setFile(e.target.files[0]);  // Uložíme soubor do stavu
    //     }
    // };

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
                };
            case "multiclass classification":
                return {
                    ...prevSettings,
                    loss: "categorical_crossentropy",
                    optimizer: "Adam",
                    opt_algorithm: "random",
                };
            case "image multiclass classification":
                return {
                    ...prevSettings,
                    loss: "categorical_crossentropy",
                    optimizer: "Adam",
                    opt_algorithm: "random",
                    use_timeout: true,
                    timeout: 600  // například 10 minut max
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




    // const handlePresetFileChange = (selectedTaskType: string) => {
    //     setAutoTask((prevAutoTask) => ({
    //         ...prevAutoTask,
    //         datasetConfig: {
    //             ...prevAutoTask.datasetConfig,
    //             encode_y: false,
    //         },
    //     }))
    //     switch (selectedTaskType) {
    //         case "binary classification":
    //             // fetch('/pima-indians-diabetes.csv')
    //             //     .then(response => response.blob())
    //             //     .then(blob => {
    //             //         const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
    //             //         setFile(defaultFile);
    //             //     })
    //             //     .catch(error => console.error("Chyba při načítání souboru:", error));
    //             // setSelectedDataset("pima-indians-diabetes.csv")
    //             // setUseDefaultDataset(true)
    //             // setAutoTask((prevAutoTask) => ({
    //             //     ...prevAutoTask,
    //             //     datasetConfig: {
    //             //         ...prevAutoTask.datasetConfig,
    //             //         x_num: 8,
    //             //         y_num: 9,
    //             //     },
    //             // }));
    //             break;
    //         case "multiclass classification":
    //             // fetch('/iris_prepared.npz')
    //             //     .then(response => response.blob())
    //             //     .then(blob => {
    //             //         const defaultFile = new File([blob], "iris_prepared.npz", { type: blob.type });
    //             //         setFile(defaultFile);
    //             //     })
    //             //     .catch(error => console.error("Chyba při načítání souboru:", error));
    //             // setSelectedDataset("iris_prepared.npz")
    //             // setUseDefaultDataset(true)
    //             // dataset config for iris
    //             console.log("updating encode_y");

    //             setAutoTask((prevAutoTask) => ({
    //                 ...prevAutoTask,
    //                 datasetConfig: {
    //                     ...prevAutoTask.datasetConfig,
    //                     encode_y: true,
    //                 },
    //             }))
    //             console.log(autoTask.datasetConfig.encode_y)

    //             //     layers: prevAutoTask.layers.map((layer, index) =>
    //             //         index === 0 ? { ...layer, shape: [4] } :
    //             //             index === 2
    //             //                 ? { ...layer, units: 3 }
    //             //                 : layer
    //             //     ),
    //             // }));


    //             break;
    //         case "image multiclass classification":
    //             // fetch('/cifar10_normalized.npz')
    //             //     .then(response => response.blob())
    //             //     .then(blob => {
    //             //         const defaultFile = new File([blob], "cifar10_normalized.npz", { type: blob.type });
    //             //         setFile(defaultFile);
    //             //     })
    //             //     .catch(error => console.error("Chyba při načítání souboru:", error));
    //             // setSelectedDataset("cifar10_normalized.npz")
    //             // setUseDefaultDataset(true)
    //             break;
    //         case "regression":
    //             // setSelectedDataset("")
    //             // setAutoTaskSettings("regression")
    //             // setUseDefaultDataset(true)
    //             break;

    //     }
    // }

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

        // Přidání typ úlohy a datasetu jako tagů
        const updatedTags = {
            "task": autoTask.taskType,
            "dataset": selectedDataset,
            "metric": autoTask.settings.monitor_metric,
            "userTags": tags,
        };
        console.log(JSON.stringify(updatedTags));

        // Vytvoření FormData
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
        // Udržujte referenci na stav, aby se zabránilo aktualizaci odmountované komponenty
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

        // Zajistíme, že po odmountování komponenty se zabrání změnám stavu
        return () => {
            isMounted = false;
        };
    };



    //definice přendat do jiného souboru?
    const renderMethodSpecificFields = () => {
        switch (autoTask.taskType) {
            case 'image multiclass classification':
                return (
                    <>
                        <Form.Label>Output classes:</Form.Label>
                        <DebouncedNumberInput
                            value={autoTask.layers[3]?.units}
                            onChange={(value: number) =>
                                handleLayerUnitsChange('units', 3, value)
                            }
                            timeout={500}
                            placeholder="Enter number of classes"
                            step={1}
                        />
                    </>
                );
            case 'multiclass classification':
                return (
                    <>
                        <Form.Label>Output classes:</Form.Label>
                        <DebouncedNumberInput
                            value={autoTask.layers[2]?.units}
                            onChange={(value: number) =>
                                handleLayerUnitsChange('units', 2, value)
                            }
                            timeout={500}
                            placeholder="Enter number of classes"
                            step={1}
                        />
                    </>
                );

            default:
                return null;
        }
    };

    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const [showDatasetSettingsModal, setShowDatasetSettingsModal] = useState<boolean>(false);

    const handleOpenSettingsModal = () => setShowSettingsModal(true);
    const handleCloseSettingsModal = () => setShowSettingsModal(false);


    const handleOpenDatasetSettingsModal = () => setShowDatasetSettingsModal(true);
    const handleCloseDatasetModal = () => setShowDatasetSettingsModal(false);  // Zavření modálního okna datasetu

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
                {/* {useDefaultDataset ? (
                    <p className='mb-0 px-1 text-center'><i>Default file: {selectedDataset}</i></p>
                ) : (
                    <></>
                )} */}

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

                {/* Modální okno pro úpravu nastavení modelu */}
                <AutoModelConfigForm
                    modelParams={autoTask}
                    setModelParams={setAutoTask}
                    show={showSettingsModal}
                    handleClose={handleCloseSettingsModal}
                />

                {/* <Form.Label>Opt method:</Form.Label>
                <Form.Control
                    as="select"
                    name="optMethod"
                    value={autoTask.settings.opt_algorithm || ''}
                    onChange={handleInputChange}
                >
                    {AutoOptMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </Form.Control> */}

                {/* <Form.Label className="mt-2">Input Shape: <HelpfulTip text="Input shape defines the dimensions of input data for a neural network.
                For example for images: (height, width, channels), e.g., (28, 28, 3) for an RGB image or for 
                tabular data: (number of features), e.g., (10) for a dataset with 10 columns."/>
                </Form.Label>
                <Form.Control
                    type="text"
                    value={autoTask.layers[0]?.shape ? autoTask.layers[0].shape.join(',') : ''} // Zobrazení pole jako řetězce
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputShapeChange('shape', e.target.value.split(',').map(Number)) // Převod řetězce na pole čísel
                    }
                /> */}

                {renderMethodSpecificFields()}



                {/* <Form.Label>Max Models:</Form.Label>

                <DebouncedNumberInput
                    value={autoTask.maxModels}
                    onChange={handleDebouncedNumberChange("maxModels")}
                    timeout={500}
                    placeholder="Enter maximum number of models"
                    min={1}
                    step={1}
                /> */}
                {/* <Tippy content="Limit time for which optimization can run in seconds">
                    <Form.Check
                        type="checkbox"
                        label="Use Timer"
                        checked={useTimer}
                        onChange={() => setUseTimer((prev) => !prev)}
                    />
                </Tippy> */}

                {/* {useTimer && (
                    <>
                        <Form.Label>Timeout (seconds):</Form.Label>
                        <DebouncedNumberInput
                            value={autoTask.timeOut || 0}
                            onChange={handleDebouncedNumberChange("timeOut")}
                            timeout={500}
                            placeholder="Enter timeout in seconds"
                            min={10}
                            step={10}
                        />
                    </>
                )} */}

                {/* <Form.Label>Tags: <HelpfulTip text="Model tags which are primarily used in tagging opt. method" /></Form.Label>
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Enter a tag and press Add"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    // onKeyPress={(e) => {
                    //     if (e.key === "Enter") {
                    //         e.preventDefault();
                    //         handleAddTag();
                    //     }
                    // }
                    // }
                    />
                    <Button className="ms-2" onClick={handleAddTag}>
                        Add
                    </Button>
                </div>

                <div className="mt-2 d-flex flex-wrap tags-container">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <Badge
                                key={index}
                                bg="primary"
                                className="tag mx-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleRemoveTag(tag)}
                            >
                                {tag} ✖
                            </Badge>
                        ))
                    ) : (
                        <p>No tags added yet.</p>
                    )}
                </div> */}

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
            {/* <div className="auto-model-config-progress-bar">
                <TaskProgressBar isActive={taskActive}
                    setIsActive={setTaskActive} />
            </div> */}
            {isTaskOverlayOpen && <TaskInfoOverlay />}
        </div>
    )
}
