import { useEffect, useState } from 'react';
import { configData } from '../../config/config';

interface Props {
    isActive: boolean;
    setIsActive: (active: boolean) => void; 
}

export const TaskProgressBar: React.FC<Props> = ({ isActive, setIsActive }) => {
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

    return (
        <div>
            <progress value={progress} max="100"></progress>
            <p>{progress}%</p>
        </div>
    );
};
