import { useState } from "react";
import "./ModelsPage.css"

const modelData = [
    {
        "id": 1,
        "modelName": "Model A",
        "accuracy": 0.95,
        "error": 0.05,
        "dataset": "Dataset 1"
    },
    {
        "id": 2,
        "modelName": "Model B",
        "accuracy": 0.89,
        "error": 0.11,
        "dataset": "Dataset 2"
    },
    {
        "id": 3,
        "modelName": "Model C",
        "accuracy": 0.92,
        "error": 0.08,
        "dataset": "Dataset 3"
    }
];

export const ModelsPage = () => {

    const [selectedModel, setSelectedModel] = useState(modelData[0]);

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Postranní panel vlevo */}
                <div className="col-md-3 p-3 models-panel">
                    <h4 className="text-center">Models</h4>
                    <ul className="list-group">
                        {modelData.map((model, index) => (
                            <li
                                key={index}
                                className={`list-group-item ${model.modelName === selectedModel.modelName ? 'active' : ''}`}
                                onClick={() => setSelectedModel(model)}
                                style={{ cursor: 'pointer' }}
                            >
                                {model.modelName}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Prostor vpravo */}
                <div className="col-md-9 p-3">
                    <h4>{selectedModel.modelName}</h4>
                    <p><strong>Accuracy:</strong> {selectedModel.accuracy}</p>
                    <p><strong>Error:</strong> {selectedModel.error}</p>
                    <p><strong>Dataset:</strong> {selectedModel.dataset}</p>
                </div>
            </div>
        </div>
    );
};