import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { DebouncedNumberInput } from "../../components/FormElements/DebouncedNumberInput";
import { autoTaskTypes, configData } from "../../config/config";
import { DatasetConfigModal } from "../TestPage/Features/Dataset/DatasetConfigModal";
import { AutoModelConfigForm } from "./Components/Forms/AutoModelConfigFormModal";
import { GetTaskLayers } from "./Components/TaskLayers/GetTaskLayers";
import { IAutoTaskState } from "./Models/AutoTask";
import "./AutoDesignPage.css"


export const AutoDesignPage = () => {
    const [autoTask, setAutoTask] = useState<IAutoTaskState>({
        taskType: "binary classification",
        layers: [],
        maxModels: 20,
        timeOut: 0,
        settings: {
            opt_algorithm: "random",
            optimizer: 'adam',
            loss: 'binary_crossentropy',
            metrics: ['accuracy'],
            monitor_metric: "val_accuracy",
            epochs: 10,
            batch_size: 32,
            max_models: 5,
            es_threshold: 0.7,
            GA: {
                generations: 5,
                populationSize: 5,
                numParents: 2,
                mutationRate: 0.3,
                selectionMethod: "Tournament"
            }
        },
        datasetConfig: {
            x_columns: [],          // Výchozí prázdný seznam
            x_num: 8,
            y_column: "",
            y_num: 9,
            test_size: 0.2,         // Výchozí hodnota pro testovací sadu
            // file: null,             // Výchozí hodnota pro soubor
        }
    });
    const [tags, setTags] = useState<string[]>([])


    const [useTimer, setUseTimer] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null);  // Přidáme stav pro soubor
    const { addAlert } = useAlert();

    const [tagInput, setTagInput] = useState<string>("");

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };


    // Načtení výchozích vrstev při prvním renderu
    useEffect(() => {
        const layers = GetTaskLayers("binary classification");
        setAutoTask(prevTask => ({
            ...prevTask,
            layers
        }));
    }, []); // Prázdné pole závislostí zajistí, že se efekt spustí jen jednou
    // set default dataset
    useEffect(() => {
        if (file === null) {
            fetch('/pima-indians-diabetes.csv')
                .then(response => response.blob())
                .then(blob => {
                    const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
                    setFile(defaultFile);
                })
                .catch(error => console.error("Chyba při načítání souboru:", error));
        }
    }, []);

    const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setAutoTask((prevTask) => {
            const updatedTask = {
                ...prevTask,
                [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
            };

            // Pokud se mění taskType, aktualizujte layers
            if (name === "taskType") {
                updatedTask.layers = GetTaskLayers(value);
                handlePresetFileChange(value)
            }

            return updatedTask;
        });
    };

    const handleInputShapeChange = (key: string, value: number[]) => {
        setAutoTask((prevState) => {
            // Pokud layers ještě nemá žádný prvek, přidáme výchozí vrstvu
            const layers = [...prevState.layers];
            // Pokud první vrstva existuje, upravíme její hodnotu shape
            layers[0] = {
                ...layers[0],
                [key]: value,
            };
            return { ...prevState, layers };
        });
    };

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

    const handleDebouncedNumberChange = useCallback((key: keyof IAutoTaskState) => {
        return (value: number) => {
            console.log(value)
            setAutoTask((prev) => ({
                ...prev,
                [key]: value,
            }));
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);  // Uložíme soubor do stavu
        }
    };

    const handlePresetFileChange = (selectedTaskType: string) => {
        switch (selectedTaskType) {
            case "binary classification":
                fetch('/pima-indians-diabetes.csv')
                    .then(response => response.blob())
                    .then(blob => {
                        const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
                        setFile(defaultFile);
                    })
                    .catch(error => console.error("Chyba při načítání souboru:", error));
                break;
            case "multiclass classification":
                fetch('/iris_prepared.npz')
                    .then(response => response.blob())
                    .then(blob => {
                        const defaultFile = new File([blob], "iris_prepared.npz", { type: blob.type });
                        setFile(defaultFile);
                    })
                    .catch(error => console.error("Chyba při načítání souboru:", error));

                // dataset config for iris
                setAutoTask((prevAutoTask) => ({
                    ...prevAutoTask,
                    datasetConfig: {
                        ...prevAutoTask.datasetConfig,
                        x_num: 4,
                        y_num: 5,
                    },
                    layers: prevAutoTask.layers.map((layer, index) =>
                        index === 0 ? { ...layer, shape: [4] } :
                            index === 2
                                ? { ...layer, units: 3 }
                                : layer
                    ),
                }));


                break;
            case "image multiclass classification":
                fetch('/cifar10_normalized.npz')
                    .then(response => response.blob())
                    .then(blob => {
                        const defaultFile = new File([blob], "cifar10_normalized.npz", { type: blob.type });
                        setFile(defaultFile);
                    })
                    .catch(error => console.error("Chyba při načítání souboru:", error));
                break;
        }
    }

    const handleSubmit = async () => {
        try {
            // console.log(autoTask)
            console.log(JSON.stringify(autoTask.layers))
            console.log(JSON.stringify(autoTask.settings))
            console.log(JSON.stringify(autoTask.datasetConfig))

            if (!file) {
                addAlert("Please select a file before submitting", "error");
                return;
            }

            // Přidání typ úlohy a datasetu jako tagů na začátek
            const updatedTags = {
                "task": autoTask.taskType,
                "dataset": file.name,
                "metric": autoTask.settings.monitor_metric,
                "userTags": tags
            };
            console.log(JSON.stringify(updatedTags))

            const formData = new FormData();
            formData.append("datasetFile", file);  // Přidáme soubor do FormData
            formData.append("taskType", autoTask.taskType);
            // formData.append("optMethod", autoTask.settings.opt_algorithm);
            formData.append('layers', JSON.stringify(autoTask.layers));  // Přidání vrstev do FormData
            formData.append("settings", JSON.stringify(autoTask.settings)) //add settings to form
            formData.append("datasetConfig", JSON.stringify(autoTask.datasetConfig))
            formData.append("maxModels", JSON.stringify(autoTask.maxModels))
            formData.append("timeOut", JSON.stringify(autoTask.timeOut))
            formData.append("tags", JSON.stringify(updatedTags))

            addAlert("Task sent to server", "info")

            const response = await fetch(`${configData.API_URL}/api/models/save-auto-model`, {
                method: 'POST',
                credentials: 'include',
                body: formData,  // Odesíláme FormData místo JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Model successfully sent to backend:', result);
            addAlert(result.message, "success");
        } catch (error: any) {
            if (error instanceof Error) {
                addAlert("" + error.message, "error");
                console.error('Error sending model to backend:', error);
            } else {
                console.error('Unexpected error', error);
                addAlert("Unexpected error", "error");
            }
        }
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
                            min={1}
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
                            min={1}
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
            <Form.Group>
                <Form.Label>Task type:</Form.Label>
                <Form.Control
                    as="select"
                    name="taskType"
                    value={autoTask.taskType || ''}
                    onChange={handleInputChange}
                >
                    {autoTaskTypes.map(tt => (
                        <option key={tt} value={tt}>{tt}</option>
                    ))}
                </Form.Control>

                <div className='d-flex flex-row justify-content-center flex-wrap'>
                    <Button className='m-1' onClick={handleOpenDatasetSettingsModal}> Dataset Config</Button>
                    <Button className='m-1' onClick={handleOpenSettingsModal}> Model Settings</Button>
                </div>

                <DatasetConfigModal
                    modelParams={autoTask}
                    setModelParams={setAutoTask}
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

                <Form.Label>Upload Dataset:</Form.Label>
                <Form.Control
                    type="file"
                    accept=".csv, .npz"
                    onChange={handleFileChange}
                />
                {file ? (
                    <p>Default file: {file.name}</p>
                ) : (
                    <p>No file selected</p>
                )}

                <Form.Label>Input Shape:</Form.Label>
                <Form.Control
                    type="text"
                    value={autoTask.layers[0]?.shape ? autoTask.layers[0].shape.join(',') : ''} // Zobrazení pole jako řetězce
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputShapeChange('shape', e.target.value.split(',').map(Number)) // Převod řetězce na pole čísel
                    }
                />

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

                <Form.Check
                    type="checkbox"
                    label="Use Timer"
                    checked={useTimer}
                    onChange={() => setUseTimer((prev) => !prev)}
                />

                {useTimer && (
                    <>
                        <Form.Label>Timeout (seconds):</Form.Label>
                        <DebouncedNumberInput
                            value={autoTask.timeOut || 0}
                            onChange={handleDebouncedNumberChange("timeOut")}
                            timeout={500}
                            placeholder="Enter timeout in seconds"
                            min={0}
                            step={1}
                        />
                    </>
                )}

                <Form.Label>Tags:</Form.Label>
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
                </div>
            </Form.Group>


            {/* <Button className="m-2" onClick={() => console.log(tags)}>Submit Tags</Button> */}

            <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>
        </div>
    )
}
