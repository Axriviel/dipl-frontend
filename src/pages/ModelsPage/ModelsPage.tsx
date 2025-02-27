import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import imgUrl from "../../assets/bj.jpeg";
import { useAlert } from "../../components/Alerts/AlertContext";
import { MetricLineChart } from "../../components/Charts/MetricLineChart";
import { DataNeededInfo } from "../../components/DataNeededInfo/DataNeededInfo";
import { GetStructureDetails } from "../../components/ModelStructure/GetStructureDetails";
import { IModelStructureData } from "../../components/ModelStructure/Models/ModelStructureData";
import { ModelStructureModal } from "../../components/ModelStructure/ModelStructureModal";
import { DeleteModel } from "../../features/Models/DeleteModel";
import { DownloadModel } from "../../features/Models/DownloadModel";
import { GetModels } from "../../features/Models/GetModels";
import { IModel } from "../../features/Models/models/Model";
import "./ModelsPage.css";
import { configData } from "../../config/config";
import DataModal from "../../components/ModelDetails/ModelDetailsModal";
import Tippy from "@tippyjs/react";
// import Tippy from "@tippyjs/react";


export const ModelsPage = () => {
    const [models, setModels] = useState<IModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<IModel | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true)
    const [refetch, setRefetch] = useState<boolean>(true)
    const { addAlert } = useAlert()
    const [modelStructureData, setModelStructureData] = useState<IModelStructureData | null>(null);

    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleClose = () => setShowDetailsModal(false);
    const handleCloseParams = () => setShowParamsModal(false);

    const handleDownload = () => {
        DownloadModel(selectedModel!.id)
    }

    const handleShowDetails = async () => {
        try {
            if (selectedModel !== undefined) {
                const result = await GetStructureDetails(selectedModel.id);

                if (result.success) {
                    setModelStructureData(result.data);
                    setShowDetailsModal(true)
                } else {
                    addAlert("" + result.message, "error");
                    console.error(result.message);
                }
            }
            else {
                console.log("model undefined")
            }
        } catch (error) {
            console.error("Error fetching model details:", error);
        }
    };

    // const handleShowParams = () => {
    //     window.location.href = `${configData.API_URL}/api/get-params/${selectedModel?.id}`;
    // }

    const [showParamsModal, setShowParamsModal] = useState(false);
    const [paramsModalData, setParamsModalData] = useState(null);


    const handleShowParams = async () => {
        try {
            const response = await fetch(`${configData.API_URL}/api/get-params/${selectedModel?.id}`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setParamsModalData(data);
            setShowParamsModal(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

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
                            <Tippy content="Download model in .keras format to your PC">
                                <Button onClick={handleDownload} className="m-2">
                                    Download Model
                                </Button>
                            </Tippy>
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
                        <h4 className="text-center">Metric history graph</h4>
                        {/* <MetricLineChart metricValues={mockTrainingData} metric="accuracy" /> */}
                        <MetricLineChart metricValues={selectedModel.metric_values_history} metric={selectedModel.watched_metric} />
                    </div>

                    {/* right section */}
                    <div className="col-md-3 p-3 px-5 d-flex flex-column align-items-left">
                        <h3>{selectedModel?.name}</h3>
                        {/* {selectedModel.id} */}
                        {/* <p><strong>Accuracy:</strong> {selectedModel?.accuracy}</p> */}
                        <p><strong>Metric:</strong> {selectedModel?.watched_metric}</p>
                        <p><strong>Metric_value:</strong> {selectedModel?.metric_value}</p>
                        <p><strong>Opt method:</strong> {selectedModel?.used_opt_method}</p>
                        {/* <p><strong>Error:</strong> {selectedModel?.error}</p> */}
                        <p><strong>Dataset:</strong> {selectedModel?.dataset}</p>
                        <Tippy content="Display layers summary">
                            <Button onClick={handleShowDetails} className="m-2">
                                Summary
                            </Button>
                        </Tippy>
                        <Tippy content="Show model parameters and downloadable JSON" placement="bottom">
                            <Button onClick={handleShowParams} className="m-2">
                                Params
                            </Button>
                        </Tippy>

                        {paramsModalData && <DataModal show={showParamsModal} data={paramsModalData} onClose={handleCloseParams} />}

                        {/* show modal only when data exist */}
                        {modelStructureData && (
                            <ModelStructureModal
                                modelName={selectedModel.name}
                                data={modelStructureData}
                                show={showDetailsModal}
                                onClose={handleClose}
                            />
                        )}
                    </div>


                </div>
            </div >
        }</>
    );
};