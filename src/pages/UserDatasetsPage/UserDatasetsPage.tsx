import { useEffect, useState } from "react";
import "./UserDatasetsPage.css";
import { GetUserDatasets } from "../../features/UserDatasets/GetDatasets";
import { IUserDataset } from "../../features/UserDatasets/Models/UserDataset";
import { Button } from "react-bootstrap";
import { useAlert } from "../../components/Alerts/AlertContext";
import { configData } from "../../config/config";
import { UploadDatasetModal } from "./Components/UploadDatasetModal";

export const UserDatasetsPage = () => {
    const [datasets, setDatasets] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [datasetDetails, setDatasetDetails] = useState<any>(null);
    const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
    const { addAlert } = useAlert();
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    useEffect(() => {
        fetchDatasets();
    }, []);

    useEffect(() => {
        if (selectedDataset) {
            fetchDatasetDetails(selectedDataset);
        }
    }, [selectedDataset]);

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

    const fetchDatasetDetails = (dataset: string) => {
        setDetailsLoading(true)
        fetch(`${configData.API_URL}/api/dataset/details`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_name: dataset }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || `Error ${response.status}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setDatasetDetails(data);
                setDetailsLoading(false)
                console.log(data)
            })
            .catch((error) => {
                console.error("Error fetching dataset details:", error);
                addAlert(error.message || "Error fetching dataset details", "error");
                setDatasetDetails(null);
            });
    };

    const handleDatasetClick = (dataset: string) => {
        setSelectedDataset(dataset);
    };

    const handleDeleteDataset = (dataset: string) => {
        if (!window.confirm(`Do you really want to delete "${dataset}"?`)) return;

        fetch(`${configData.API_URL}/api/dataset/delete`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_name: dataset }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || `Error ${response.status}`);
                    });
                }
                return response.json();
            })
            .then((result) => {
                addAlert(result.message, "success");
                fetchDatasets();
                if (selectedDataset === dataset) {
                    setSelectedDataset(null);
                    setDatasetDetails(null);
                }
            })
            .catch((error) => {
                console.error("Error deleting dataset:", error);
                addAlert(error.message || "Error deleting dataset", "error");
            });
    };

    return (
        <div className="datasets-container my-5">
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
            {/* {console.log(datasetDetails.shape?? "")} */}
            {
                selectedDataset && (
                    !detailsLoading && datasetDetails ?
                        <div className="dataset-details">
                            <h3>Dataset Details: {selectedDataset}</h3>
                            <div><strong>Rows:</strong>
                                <ul>
                                    {datasetDetails.shape
                                        ? Object.entries(datasetDetails.num_rows).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}:</strong> {JSON.stringify(value)}
                                            </li>
                                        ))
                                        : "N/A"}
                                </ul>

                            </div>
                            <div><strong>Columns:</strong>
                                <ul>
                                    {datasetDetails.shape
                                        ? Object.entries(datasetDetails.num_columns).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}:</strong> {JSON.stringify(value)}
                                            </li>
                                        ))
                                        : "N/A"}
                                </ul>
                            </div>
                            <div>  <strong>Shape:</strong>

                                <ul>
                                    {datasetDetails.shape
                                        ? Object.entries(datasetDetails.shape).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}:</strong> {JSON.stringify(value)}
                                            </li>
                                        ))
                                        : "N/A"}
                                </ul>
                            </div>
                            <p><strong>Column names:</strong> {datasetDetails.column_names ? datasetDetails.column_names.join(", ") : "N/A"}</p>
                        </div>
                        : <p>"Loading"</p>
                )}

            <UploadDatasetModal
                show={showUploadModal}
                handleClose={() => setShowUploadModal(false)}
                onUploadSuccess={fetchDatasets}
            />
        </div>
    );
};
