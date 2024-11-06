import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { DeleteModel } from "../../features/Models/DeleteModel";
import { DownloadModel } from "../../features/Models/DownloadModel";
import { GetModels } from "../../features/Models/GetModels";
import { IModel } from "../../features/Models/models/Model";
import "./ModelsPage.css";
import { MetricLineChart } from "../../components/Charts/MetricLineChart";
import { DataNeededInfo } from "../../components/DataNeededInfo/DataNeededInfo";
import imgUrl from "../../assets/bj.jpeg"
// import Tippy from "@tippyjs/react";


// const mockTrainingData = [
//     { epoch: 1, value: 0.5 },
//     { epoch: 2, value: 0.65 },
//     { epoch: 3, value: 0.78 },
//     { epoch: 4, value: 0.8 },
//     { epoch: 5, value: 0.86 },
//     { epoch: 6, value: 0.91 },
//     { epoch: 7, value: 0.93 },
//     { epoch: 8, value: 0.935 },
//     { epoch: 9, value: 0.94 },
//     { epoch: 10, value: 0.945 },
//     { epoch: 11, value: 0.948 },
//     { epoch: 12, value: 0.95 },
//     { epoch: 13, value: 0.951 },
//     { epoch: 14, value: 0.953 },
//     { epoch: 15, value: 0.955 },
// ];


export const ModelsPage = () => {
    const [models, setModels] = useState<IModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<IModel | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true)
    const [refetch, setRefetch] = useState<boolean>(true)
    const { addAlert } = useAlert()

    const handleDownload = () => {
        DownloadModel(selectedModel!.id)
    }

    const handleShowDetails = () => {
        //tba - zobrazit to v rámci modálu, nebo nějak lépe.
        window.location.href = `http://localhost:5000/api/get-details/${selectedModel!.id}`
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
                addAlert("" + result.message, "error");
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
        <>{loading ? "loading" : selectedModel === undefined ?
            <DataNeededInfo
                content="You dont have any models yet"
                imageUrl={imgUrl} /> :


            <div className="models-container">

                <div className="d-flex flex-row justify-content-center flex-wrap">
                    {/* Postranní panel vlevo */}
                    <div className="col-md-3 p-3 px-5 models-panel overflow-auto">
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

                    {/* chart section */}
                    <div className="metric-chart col-md-6 col-lg-6 p-3 section-border">
                        <h4 className="text-center">Graf metriky</h4>
                        {/* <MetricLineChart metricValues={mockTrainingData} metric="accuracy" /> */}
                        <MetricLineChart metricValues={selectedModel.metric_values_history} metric={selectedModel.watched_metric} />
                    </div>

                    {/* right section */}
                    <div className="col-md-3 p-3 px-5 d-flex flex-column align-items-center">
                        <h4>{selectedModel?.name}</h4>
                        {/* {selectedModel.id} */}
                        <p><strong>Accuracy:</strong> {selectedModel?.accuracy}</p>
                        <p><strong>Metric:</strong> {selectedModel?.watched_metric}</p>
                        <p><strong>Metric_value:</strong> {selectedModel?.metric_value}</p>
                        <p><strong>Error:</strong> {selectedModel?.error}</p>
                        <p><strong>Dataset:</strong> {selectedModel?.dataset}</p>

                        <Button onClick={handleShowDetails} className="m-2">
                            Details
                        </Button>
                    </div>


                </div>
            </div >
        }</>
    );
};