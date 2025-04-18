import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import imgUrl from "../../assets/empty_state.png";
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
import { DownloadJSON } from "../../features/Models/DownloadJSON";
import { ModelProtocolModal } from "../../components/ModelProtocolModal/ModelProtocolModal";
// import Tippy from "@tippyjs/react";


export const ModelsPage = () => {
    const [models, setModels] = useState<IModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<IModel | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true)
    const [refetch, setRefetch] = useState<boolean>(true)
    const { addAlert } = useAlert()
    const [modelStructureData, setModelStructureData] = useState<IModelStructureData | null>(null);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showProtocolModal, setShowProtocolModal] = useState(false);

    const handleClose = () => setShowDetailsModal(false);
    const handleCloseParams = () => {
        setShowParamsModal(false);

        const blurredModals = document.querySelectorAll(".modal.modal-blurred");
        blurredModals.forEach(modal => modal.classList.remove("modal-blurred"));
    };
    const handleCloseProtocol = () => setShowProtocolModal(false);

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

    const [showParamsModal, setShowParamsModal] = useState(false);
    const [paramsModalData, setParamsModalData] = useState(null);

    // refresh data every minute
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("refetch");

            setRefetch(prev => !prev);
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchParamsData();
    }, [selectedModel]);

    const fetchParamsData = useCallback(async () => {
        if (!selectedModel) {
            setParamsModalData(null);
            return;
        }

        try {
            const response = await fetch(`${configData.API_URL}/api/get-params/${selectedModel.id}`);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            setParamsModalData(data);
        } catch (error) {
            console.error("Error fetching model params:", error);
            setParamsModalData(null);
        }
    }, [selectedModel]);

    const handleShowParams = async () => {
        try {
            setShowParamsModal(true);
            const modals = document.querySelectorAll(".modal.show");
            if (modals.length >= 1) {
                modals[modals.length - 1].classList.add("modal-blurred");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handleShowProtocol = async () => {
        try {
            setShowProtocolModal(true);
            // console.log("epochs:", selectedModel?.task_protocol.epochs);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDeleteModel = async (modelId: number) => {
        try {
            const result = await DeleteModel(modelId);

            if (result.success) {
                addAlert(result.message || 'Model successfully deleted', "success");
                setSelectedModel(models[0] ?? undefined)
                setRefetch(!refetch);
            } else {
                if (result.status === 409) {
                    addAlert("Model not found or already deleted", "warning");
                    setRefetch(!refetch);
                } else {
                    addAlert(result.message || 'Failed to delete the model', "error");
                }
            }
        } catch (error) {
            addAlert("An unexpected error occurred while deleting the model", "error");
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
        if (models.length > 0 && !selectedModel) {
            setSelectedModel(models[0])
        }
        else if (selectedModel) {
            return
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
                        <div className="list-group">
                            <ul className="px-2">
                                {models.map(model => (
                                    <li
                                        key={"model_" + model.id}
                                        className={`list-group-item ${model.id === selectedModel!.id ? 'active' : ''}`}
                                        // onClick={() => setSelectedModel(model)}
                                        onClick={() => { setSelectedModel(model)}}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {model.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Přidání tlačítka pro stažení modelu */}
                        <div className="d-flex justify-content-center flex-wrap px-2">
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
                    <div className="col-md-3 p-3 px-5 d-flex info-right-section-wrapper">
                        <div className="d-flex flex-column align-items-left info-right-section">
                            <h3>{selectedModel?.name}</h3>
                            <p><strong>Designer:</strong> {selectedModel?.used_designer}</p>
                            <p><strong>Metric:</strong> {selectedModel?.watched_metric}</p>
                            <p><strong>Metric_value:</strong> {selectedModel?.metric_value}</p>
                            <p><strong>Opt method:</strong> {selectedModel?.used_opt_method}</p>
                            <p><strong>Dataset:</strong> {selectedModel?.dataset}</p>
                            <p><strong>Protocol:</strong> <span className="pointer-underline" onClick={handleShowProtocol}>HERE</span></p>
                            <p><strong>Created:</strong> {selectedModel?.task_protocol.finished_at}</p>
                            <p><strong>Used tags:</strong> {selectedModel?.used_tags.user_tags ?? "no user defined tags"}</p>
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

                            <Tippy content="Downloads this model in JSON format, which can be uploaded in custom designer to further work with it">
                                <Button onClick={DownloadJSON(paramsModalData)} disabled={!paramsModalData} className="m-2">Download JSON</Button>
                            </Tippy>

                            {paramsModalData && <DataModal show={showParamsModal} data={paramsModalData} onClose={handleCloseParams} />}

                            {/* show modal only when data exist */}
                            {modelStructureData && (
                                <ModelStructureModal
                                    paramsButton={handleShowParams}
                                    modelName={selectedModel.name}
                                    data={modelStructureData}
                                    show={showDetailsModal}
                                    onClose={handleClose}
                                />
                            )}

                            {selectedModel.task_protocol && (
                                <ModelProtocolModal
                                    modelName={selectedModel.name}
                                    data={selectedModel.task_protocol}
                                    show={showProtocolModal}
                                    onClose={handleCloseProtocol}
                                />
                            )}
                        </div>
                    </div>


                </div>
            </div >
        }</>
    );
};