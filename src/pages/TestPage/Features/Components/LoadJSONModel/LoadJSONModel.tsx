import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { IModelParams } from "../../../Models/ModelParams";
import { loadWithReplace } from "./LoadWithReplace";
import { loadPureConfig } from "./LoadPureConfig";
import { useAlert } from "../../../../../components/Alerts/AlertContext";

interface LoadJsonModelProps {
    setModelParams: (params: IModelParams) => void;
}

export const LoadJsonModel: React.FC<LoadJsonModelProps> = ({ setModelParams }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [useReplace, setUseReplace] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { addAlert } = useAlert();


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file); // Uložíme soubor do stavu
    };

    const handleUpload = () => {
        if (!selectedFile) {
            console.error("No file selected!");
            return;
        }
        try {
            if (useReplace) {
                loadWithReplace(selectedFile, setModelParams);
            } else {
                loadPureConfig(selectedFile, setModelParams);
            }
            addAlert("Config uploaded and parsed", "success");

        }
        catch (error) {
            addAlert("Error " + error, "error");
        }
    };


    return (
        <div className="d-flex flex-column align-items-center">
            <Form.Label>Load Model Configuration (JSON)</Form.Label>
            <span>Upload mode: {useReplace ? "replacement" : "pure"}</span>
            <Form.Check
                type="checkbox"
                label="Use Replace Logic"
                checked={useReplace}
                onChange={() => setUseReplace(!useReplace)}
                className="mt-2"
            />
            <Form.Control
                type="file"
                accept=".json"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <Button className="mt-2" onClick={() => fileInputRef.current?.click()}>
                Select JSON File
            </Button>

            {/* Potvrzovací tlačítko pro nahrání souboru */}
            <Button
                className="mt-2"
                onClick={handleUpload}
                disabled={!selectedFile} // Neaktivní, pokud není vybraný soubor
            >
                Confirm Upload
            </Button>
        </div>
    );
};
