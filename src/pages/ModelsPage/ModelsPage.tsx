import { useEffect, useState } from "react";
import "./ModelsPage.css"
import { DownloadModel } from "../../features/Models/DownloadModel";
import { Button } from "react-bootstrap";
import { DeleteModel } from "../../features/Models/DeleteModel";
import { Model } from "../../features/Models/models/Model";
import { configData } from "../../config/config";

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
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true)

    const handleDownload = () => {
        DownloadModel(selectedModel!.id)
    }

    useEffect(() => {
        // Fetch data from the Flask backend
        fetch(`${configData.API_URL}/api/getmodels`)
            .then(response => response.json())
            .then(data => {
                setModels(data);
                setLoading(false);

            })
            .catch(error => {
                console.error("Error fetching feedback:", error);
            });
    }, []);

    useEffect(() => {
        if (models.length > 0) {
            setSelectedModel(models[0])
            console.log("jsem tady" + models)
        }
        else{
            setSelectedModel(undefined)
        }
    }, [models])

    return (
        <>{loading ? "loading" : selectedModel === undefined?"Zatím nemáte modely":
            <div className="models-container">

                <div className="d-flex flex-row justify-content-center flex-wrap">
                    {/* Postranní panel vlevo */}
                    <div className="col-md-3 p-3 models-panel overflow-auto">
                        <h4 className="text-center">Models</h4>
                        <ul className="list-group">
                            {models.map(model => (
                                <li
                                    key={"model_" + model.id}
                                    className={`list-group-item ${model.id === selectedModel!.id ? 'active' : ''}`}
                                    onClick={() => setSelectedModel(model)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {model.name}
                                </li>
                            ))}
                        </ul>
                        {/* Přidání tlačítka pro stažení modelu */}
                        <div className="d-flex justify-content-center flex-wrap">
                            <Button onClick={handleDownload} className="m-2">
                                Download Model
                            </Button>
                            <Button onClick={() => DeleteModel(selectedModel!.id)} className="m-2">
                                Delete Model
                            </Button>
                        </div>
                    </div>

                    {/* Prostor vpravo */}
                    <div className="col-md-9 p-3 px-5">
                        <h4>{selectedModel?.name}</h4>
                        <p><strong>Accuracy:</strong> {selectedModel?.accuracy}</p>
                        <p><strong>Error:</strong> {selectedModel?.error}</p>
                        <p><strong>Dataset:</strong> {selectedModel?.dataset}</p>
                    </div>
                </div>
            </div>
        }</>
    );
};