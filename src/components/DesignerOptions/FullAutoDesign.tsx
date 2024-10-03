import { ChangeEventHandler, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { taskTypes } from "../../features/ModelLayers/TaskTypes";
import { configData } from "../../config/config";
import { AutoOptMethods } from "../../features/ModelDesigner/AutoOptMethods";
import { useAlert } from "../Alerts/AlertContext";

interface ITaskState {
    dataset: string;
    taskType: string;
    optMethod: string;
}

export const FullAutoDesign = () => {
    const [newTask, setNewTask] = useState<ITaskState>({ dataset: "Diabetes", taskType: "classification", optMethod: "random" });
    const [file, setFile] = useState<File | null>(null);  // Přidáme stav pro soubor
    const { addAlert } = useAlert();

    const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);  // Uložíme soubor do stavu
        }
    };

    const handleSubmit = async () => {
        try {
            if (!file) {
                addAlert("Please select a file before submitting", "error");
                return;
            }

            const formData = new FormData();
            formData.append("datasetFile", file);  // Přidáme soubor do FormData
            formData.append("taskType", newTask.taskType);
            formData.append("optMethod", newTask.optMethod);

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

    return (
        <div className="d-flex flex-column align-items-center">
            <Form.Group>
                <Form.Label>Inputs:</Form.Label>
                <Form.Control
                    as="select"
                    name="taskType"
                    value={newTask.taskType || ''}
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
                    value={newTask.optMethod || ''}
                    onChange={handleInputChange}
                >
                    {AutoOptMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </Form.Control>

                {/* Přidání souborového inputu */}
                <Form.Label>Upload Dataset:</Form.Label>
                <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}  // Nastavíme soubor do stavu
                />
            </Form.Group>

            <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>
        </div>
    )
}
