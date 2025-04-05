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
    const [taskFinished, setTaskFinished] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(true);

    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let interval: number | null = null;

        const fetchProgress = async () => {
            try {
                const response = await fetch(`${configData.API_URL}/api/task-progress`, {
                    method: "GET",
                    credentials: "include", // Povolení odesílání cookies
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
                        setTaskFinished(true)
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

                // Pokud úloha skončila, vypneme progress bar
                if (!data.isRunning) {
                    // setIsActive(false);
                }
            } catch (error) {
                console.error("Error fetching progress:", error);
                setTaskActive(false)
                setProgress(0);
                // setIsActive(false); 
            }
        };


        if (isActive) {
            fetchProgress(); // První načtení ihned
            interval = window.setInterval(fetchProgress, 5000); // Poté každých 5 sekund
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
                <strong>Task status:</strong> {taskFinished ? <span task-finished>Finished</span> : taskActive ? <span className="task-active"> Active </span> : <span className="task-inactive"> Not running </span>}
            </div>
            {/* {taskActive ? */}
            <div>
                <TaskProgressBar progress={progress} />
                <Button className='cancel-task-button' variant='danger' onClick={cancelTask}>Cancel task</Button>
            </div>
            {/* : <></>} */}
        </div>
    )
}