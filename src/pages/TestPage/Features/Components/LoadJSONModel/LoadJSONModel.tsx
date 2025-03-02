import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAlert } from "../../../../../components/Alerts/AlertContext";
import { HelpfulTip } from "../../../../../features/Tooltip";
import { IModelParams } from "../../../Models/ModelParams";
import { loadPureConfig } from "./LoadPureConfig";
import { loadWithReplace } from "./LoadWithReplace";

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
        <div className="d-flex flex-column align-items-left px-5">
            <Form.Label className="">Load Model Configuration (JSON)</Form.Label>
            <Form.Control
            className="w-100"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            {/* <Button className="mt-2" onClick={() => fileInputRef.current?.click()}>
                Select JSON File
            </Button> */}
            <span>Upload mode: {useReplace ? "replacement" : "pure"} <HelpfulTip text="Replacement mode replaces generators with used layers and sets every parameter to used value. Pure mode uses abstract setup."></HelpfulTip></span>
            <Form.Check
                type="checkbox"
                label="Use Replacement Logic"
                checked={useReplace}
                onChange={() => setUseReplace(!useReplace)}
                className="mt-2"
            />
            {/* Potvrzovací tlačítko pro nahrání souboru */}
            <Button
                className="mt-2 w-50"
                onClick={handleUpload}
                disabled={!selectedFile} // Neaktivní, pokud není vybraný soubor
            >
                Confirm Upload
            </Button>
        </div>
    );
};
