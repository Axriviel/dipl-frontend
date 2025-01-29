import { useEffect, useState } from "react";
import "./UserDatasetsPage.css";
import { GetUserDatasets } from "../../features/UserDatasets/GetDatasets";
import { IUserDataset } from "../../features/UserDatasets/Models/UserDataset";
import { Button} from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { configData } from "../../config/config";
import { UploadDatasetModal } from "./Components/UploadDatasetModal";

export const UserDatasetsPage = () => {
    const [datasets, setDatasets] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
    const { addAlert } = useAlert();
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = () => {
        setLoading(true);
        GetUserDatasets()
            .then((data: IUserDataset) => {
                setDatasets(data.datasets);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    };

    const handleDatasetClick = (dataset: string) => {
        setSelectedDataset(dataset);
    };

    const handleDeleteDataset = (dataset: string) => {
        if (!window.confirm(`Opravdu chcete smazat dataset "${dataset}"?`)) return;

        fetch(`${configData.API_URL}/api/dataset/delete`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_name: dataset }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || `Chyba ${response.status}`);
                    });
                }
                return response.json();
            })
            .then((result) => {
                addAlert(result.message, "success");
                fetchDatasets();
            })
            .catch((error) => {
                console.error("Chyba při mazání datasetu:", error);
                addAlert(error.message || "Nepodařilo se smazat dataset", "error");
            });
    };

    return (
        <div className="datasets-container">
            <h2>My datasets:</h2>

            <Button className="upload-button" onClick={() => setShowUploadModal(true)}>
                📤 Upload Dataset
            </Button>

            {loading && <p>Loading datasets...</p>}
            {error && <p className="error">Error: {error}</p>}

            {!loading && !error && datasets.length === 0 && <p>No datasets available.</p>}

            {!loading && !error && datasets.length > 0 && (
                <ul className="dataset-list">
                    {datasets.map((dataset, index) => (
                        <li
                            key={index}
                            className={`dataset-item ${selectedDataset === dataset ? "selected" : ""}`}
                            onClick={() => handleDatasetClick(dataset)}
                        >
                            {dataset}
                            <Button
                                variant="danger"
                                size="sm"
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDataset(dataset);
                                }}
                            >
                                🗑️ Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedDataset && <p>Selected dataset: {selectedDataset}</p>}

            {/* Modální okno pro nahrání datasetu */}
            <UploadDatasetModal
                show={showUploadModal}
                handleClose={() => setShowUploadModal(false)}
                onUploadSuccess={fetchDatasets} // Aktualizace seznamu datasetů po nahrání
            />
        </div>
    );
};
