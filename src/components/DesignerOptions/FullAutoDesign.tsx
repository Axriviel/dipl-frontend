import { ChangeEventHandler, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { taskTypes } from "../../features/ModelLayers/TaskTypes";

interface TaskState {
    dataset: string;
    taskType: string;
}

export const FullAutoDesign = () => {
    const [newTask, setNewTask] = useState<TaskState>({ dataset: "", taskType: "" });

    const handleInputChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        console.log(JSON.stringify(newTask))
    }

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
            </Form.Group>

            <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>

        </div>
    )
}
