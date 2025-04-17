import "./TaskInfoOverlay.css"
import { TaskProgressBar } from "../../features/ModelProgressBar/ProgressBar"
import { Button } from "react-bootstrap"
import { configData } from "../../config/config";
import { useAlert } from "../Alerts/AlertContext";
import { useEffect, useState } from "react";

interface Props {
    // isActive: boolean;
    // setIsActive: (active: boolean) => void;
}

export const TaskInfoOverlay: React.FC<Props> = () => {
    const { addAlert } = useAlert();
    const [taskActive, setTaskActive] = useState<boolean>(false);
    // const [taskFinished, setTaskFinished] = useState<boolean>(false);
    const [isActive] = useState<boolean>(true);

    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let interval: number | null = null;

        const fetchProgress = async () => {
            try {
                const response = await fetch(`${configData.API_URL}/api/task-progress`, {
                    method: "GET",
                    credentials: "include", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.progress !== undefined && Number.isFinite(data.progress)) {
                    if (data.progress === -1) {
                        console.log("-1 progress");
                        setProgress(100)
                        setTaskActive(false)
                    }
                    else {
                        setTaskActive(true)
                        console.log(data.progress)
                        setProgress(data.progress);
                    }
                } else {
                    console.error("Invalid progress data:", data);
                    setTaskActive(false)
                    setProgress(0);
                }

                if (!data.isRunning) {
                    // setIsActive(false);
                }
            } catch (error) {
                console.error("Error fetching progress:", error);
                setTaskActive(false)
                setProgress(0);
            }
        };


        if (isActive) {
            fetchProgress(); 
            interval = window.setInterval(fetchProgress, 5000); // how often to fetch progress
        }

        return () => {
            if (interval !== null) {
                clearInterval(interval); // Zastaví se při unmount nebo když isActive === false
            }
        };
    }, [isActive]);

    const cancelTask = async () => {
        try {
            const response = await fetch(`${configData.API_URL}/api/cancel-task`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.error);
                alert(errorData.error);
                return;
            }

            const data = await response.json();
            console.log(data.message);
            addAlert(data.message, "info");
        } catch (error) {
            console.error('Request failed', error);
            addAlert('Request failed. Try again later.', "error");
        }
    };
    return (
        <div className="task-info-overlay">
            <div>
                <strong className="text-center">Task status:</strong> {taskActive ? <span className="task-active"> Active </span> : <span className="task-inactive"> Finished </span>}
            </div>
            {/* {taskActive ? */}
            <div className="d-flex flex-column align-items-center">
                <TaskProgressBar progress={progress} />
                <Button className='cancel-task-button' variant='danger' onClick={cancelTask}>Cancel task</Button>
            </div>
            {/* : <></>} */}
        </div>
    )
}