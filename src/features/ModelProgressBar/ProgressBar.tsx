import { useEffect, useState } from 'react';
import { configData } from '../../config/config';
import "./ProgressBar.css"
import { Button } from 'react-bootstrap';
import { useAlert } from '../../components/Alerts/AlertContext';


interface Props {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
}

export const TaskProgressBar: React.FC<Props> = ({ isActive, setIsActive }) => {
    const [progress, setProgress] = useState(0);
    const { addAlert } = useAlert();

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
                    console.log(data.progress)
                    setProgress(data.progress);
                } else {
                    console.error("Invalid progress data:", data);
                    setProgress(0);
                }

                // Pokud úloha skončila, vypneme progress bar
                if (!data.isRunning) {
                    setIsActive(false);
                }
            } catch (error) {
                console.error("Error fetching progress:", error);
                setProgress(0);
                setIsActive(false);  // Pokud je error, pravděpodobně úloha skončila
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
                alert(errorData.error); // Můžeš zobrazit chybu uživateli
                return;
            }

            const data = await response.json();
            console.log(data.message); // Můžeš zobrazit zprávu uživateli
            addAlert(data.message, "info");
        } catch (error) {
            console.error('Request failed', error);
            addAlert('Request failed. Try again later.', "error");
        }
    };

    return (
        <div className='d-flex flex-row justify-content-center align-items-center'>
            <div className="task-progress-container">
                <p className="task-progress-title">Progress: {progress}%</p>
                <div className="task-progress-wrapper">
                    <div className="task-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div>
                <Button className='cancel-task-button' variant='danger' onClick={cancelTask}>Cancel task</Button>
            </div>
        </div>
    );
};
