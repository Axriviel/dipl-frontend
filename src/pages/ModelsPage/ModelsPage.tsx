import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { DeleteModel } from "../../features/Models/DeleteModel";
import { DownloadModel } from "../../features/Models/DownloadModel";
import { GetModels } from "../../features/Models/GetModels";
import { Model } from "../../features/Models/models/Model";
import "./ModelsPage.css";

export const ModelsPage = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true)
    const [refetch, setRefetch] = useState<boolean>(true)
    const { addAlert } = useAlert()

    const handleDownload = () => {
        DownloadModel(selectedModel!.id)
    }

    const handleDeleteModel = async (modelId: number) => {
        const result = await DeleteModel(modelId);
        if (result.success) {
            addAlert(result.message || 'Model successfully deleted', "success");
            setRefetch(!refetch)
        } else {
            addAlert(result.message || 'Failed to delete the model', "error");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await GetModels();

            if (result.success) {
                setModels(result.data); 
            } else {
                addAlert(""+ result.message, "error");
                console.error(result.message); 
            }

            setLoading(false);
        };

        fetchData();
    }, [refetch]); 

    useEffect(() => {
        if (models.length > 0) {
            setSelectedModel(models[0])
        }
        else {
            setSelectedModel(undefined)
        }
    }, [models])

    return (
        <>{loading ? "loading" : selectedModel === undefined ? "Zatím nemáte modely" :
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
                            <Button className="m-2" onClick={async () => {
                                await handleDeleteModel(selectedModel!.id);
                            }
                            }>
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
            </div >
        }</>
    );
};