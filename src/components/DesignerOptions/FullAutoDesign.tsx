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
    const { addAlert } = useAlert()

    const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    // const handleSubmit = async () => {
    //     console.log(JSON.stringify(newTask))
    // }

    const handleSubmit = async () => {
        try {
            console.log(JSON.stringify(newTask))

            const response = await fetch(`${configData.API_URL}/api/models/save-auto-model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ ...newTask }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                console.log(errorData.error)
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Model successfully sent to backend:', result);
            addAlert(result.message, "success")
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
            </Form.Group>

            <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>

        </div>
    )
}
