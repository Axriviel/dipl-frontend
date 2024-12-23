import { ChangeEventHandler, useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { configData } from "../../config/config";
import { AutoOptMethods } from "../../features/ModelDesigner/AutoOptMethods";
import { taskTypes } from "../../features/ModelLayers/TaskTypes";
import { useAlert } from "../../components/Alerts/AlertContext";
import { IAutoTaskState } from "./Models/AutoTask";
import { DebouncedNumberInput } from "../../components/FormElements/DebouncedNumberInput";



export const AutoDesignPage = () => {
    const [autoTask, setAutoTask] = useState<IAutoTaskState>({ taskType: "classification", optMethod: "random", maxModels: 20, timeOut: 0 });
    const [useTimer, setUseTimer] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null);  // Přidáme stav pro soubor
    const { addAlert } = useAlert();

    const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // console.log(name, value)
        setAutoTask((prevTask) => ({
            ...prevTask,
            [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
        }));
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

    const handleSubmit = async () => {
        try {
            console.log(autoTask)
            if (!file) {
                addAlert("Please select a file before submitting", "error");
                return;
            }

            const formData = new FormData();
            formData.append("datasetFile", file);  // Přidáme soubor do FormData
            formData.append("taskType", autoTask.taskType);
            formData.append("optMethod", autoTask.optMethod);

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


    const renderLayerSpecificFields = () => {
        switch (autoTask.taskType) {
            case 'random':
                return (
                    null
                );
            case 'evolution':
                return (
                    null
                );

            default:
                return null;
        }
    };

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
                    {taskTypes.map(tt => (
                        <option key={tt} value={tt}>{tt}</option>
                    ))}
                </Form.Control>
                <Form.Label>Opt method:</Form.Label>
                <Form.Control
                    as="select"
                    name="optMethod"
                    value={autoTask.optMethod || ''}
                    onChange={handleInputChange}
                >
                    {AutoOptMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </Form.Control>

                <Form.Label>Upload Dataset:</Form.Label>
                <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                <Form.Label>Max Models:</Form.Label>

                <DebouncedNumberInput
                    value={autoTask.maxModels}
                    onChange={handleDebouncedNumberChange("maxModels")}
                    timeout={500}
                    placeholder="Enter maximum number of models"
                    min={1}
                    step={1}
                />

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
            </Form.Group>

            {renderLayerSpecificFields()}

            <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>
        </div>
    )
}
