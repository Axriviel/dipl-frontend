import { ChangeEventHandler, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { taskTypes } from "../../features/ModelLayers/TaskTypes";
import { configData } from "../../config/config";
import { useAuth } from "../../features/AuthContext/AuthContext";

interface TaskState {
    dataset: string;
    taskType: string;
}

export const FullAutoDesign = () => {
    const [newTask, setNewTask] = useState<TaskState>({ dataset: "Diabetes", taskType: "" });
    const { user } = useAuth();

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
            body: JSON.stringify({ ...newTask, "user": user!.username }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const result = await response.json();
          console.log('Model successfully sent to backend:', result);
        } catch (error) {
          console.error('Error sending model to backend:', error);
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
            </Form.Group>

            <Button className="m-2" onClick={handleSubmit}>Submit Model</Button>

        </div>
    )
}
