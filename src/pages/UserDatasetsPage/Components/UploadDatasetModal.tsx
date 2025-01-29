import { useState } from "react";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import { useAlert } from "../../../components/Alerts/AlertContext";
import { configData } from "../../../config/config";

interface UploadDatasetModalProps {
    show: boolean;
    handleClose: () => void;
    onUploadSuccess: () => void;
}

export const UploadDatasetModal: React.FC<UploadDatasetModalProps> = ({ show, handleClose, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { addAlert } = useAlert();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) {
            addAlert("Vyberte soubor před nahráním!", "error");
            return;
        }

        const formData = new FormData();
        formData.append("datasetFile", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${configData.API_URL}/api/dataset/upload`, true);
        xhr.withCredentials = true; // Zajistí připojení k session

        // Sledujeme průběh nahrávání
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        setIsUploading(true);

        xhr.onload = () => {
            setIsUploading(false);
            if (xhr.status === 200) {
                addAlert("Dataset úspěšně nahrán!", "success");
                handleClose();
                onUploadSuccess(); // Aktualizace seznamu datasetů
            } else {
                const errorResponse = JSON.parse(xhr.responseText);
                addAlert(errorResponse.error || "Chyba při nahrávání datasetu", "error");
            }
        };

        xhr.onerror = () => {
            setIsUploading(false);
            addAlert("Nepodařilo se nahrát dataset. Zkontrolujte připojení k internetu.", "error");
        };

        xhr.send(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Upload new dataset</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Select file:</Form.Label>
                    <Form.Control type="file" accept=".csv, .npz" onChange={handleFileChange} disabled={isUploading} />
                </Form.Group>

                {isUploading && (
                    <div className="mt-3">
                        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                        <p className="text-center mt-2">Uploading... {uploadProgress}%</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "📤 Upload"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
