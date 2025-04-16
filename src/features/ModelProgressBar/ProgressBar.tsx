import "./ProgressBar.css";


interface Props {
    progress: number;
}

export const TaskProgressBar: React.FC<Props> = ({ progress }) => {

    return (
        <div className="task-progress-container">
            <p className="task-progress-title">Progress: {progress}%</p>
            <div className="task-progress-wrapper">
                <div className="task-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};
