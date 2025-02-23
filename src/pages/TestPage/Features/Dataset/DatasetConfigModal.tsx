import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
// import { configData } from '../../../../config/config';
import { IDatasetConfig } from '../../Models/DatasetConfig';
import { configData } from '../../../../config/config';
import { IModelParams } from '../../Models/ModelParams';

interface DatasetConfigModalProps {
    datasetName: string;
    datasetParams: IDatasetConfig;
    setDatasetConfig: React.Dispatch<React.SetStateAction<IModelParams>>;
    show: boolean;
    handleClose: () => void;
}

export const DatasetConfigModal: React.FC<DatasetConfigModalProps> = ({ datasetName, datasetParams, setDatasetConfig, show, handleClose }) => {
    const [columnNames, setColumnNames] = useState<string[]>([]); // Seznam názvů sloupců

    // Funkce pro načtení sloupců z datasetu po nahrání
    useEffect(() => {
        if (!datasetName) return;

        fetch(`${configData.API_URL}/api/dataset/get_column_names`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_name: datasetName }),

        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(`Error ${response.status}: ${errorData.error}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (!data.columns) {
                    throw new Error("Invalid response format: missing 'columns' field");
                }
                console.log("✅ Přijaté sloupce:", data.columns);
                setColumnNames(data.columns);  // Opraveno, aby se správně nastavily sloupce
            })
            .catch(error => {
                console.error("Error fetching column names:", error);
            });
    }, [datasetName]);

    // Výběr vstupních sloupců (X)
    // Výběr vstupních sloupců (X)
    const handleXColumnsChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedColumns = Array.from(e.target.selectedOptions, option => option.value);
        setDatasetConfig(prev => ({
            ...prev, 
            datasetConfig: {
                ...prev.datasetConfig,
                x_columns: selectedColumns
            }
        }));
    };

    const handleYColumnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setDatasetConfig(prev => ({
            ...prev,
            datasetConfig: {
                ...prev.datasetConfig,
                y_column: e.target.value
            }
        }));
    };

    //handle change
    const handleDatasetConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = parseFloat(value);

        setDatasetConfig(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Dataset Configuration</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Nahrání datasetu */}
                    {/* <Form.Group controlId="formFileUpload">
                        <Form.Label>Upload Dataset</Form.Label>
                        <Form.Control
                            disabled
                            type="file"
                            accept=".csv,.tsv,.npy,.npz,.h5"
                            onChange={handleFileChange}
                        />
                    </Form.Group> */}

                    {/* Výběr sloupců pro vstupy X */}
                    <Form.Group controlId="formXColumns">
                        <Form.Label>Input Columns (X)</Form.Label>
                        <Form.Select as="select" multiple onChange={handleXColumnsChange}>
                            {columnNames.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Výběr sloupce pro výstup Y */}
                    <Form.Group controlId="formYColumn">
                        <Form.Label>Output Column (Y)</Form.Label>
                        <Form.Select as="select" onChange={handleYColumnChange}>
                            <option value="">-- Select Output Column --</option>
                            {columnNames.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Nastavení testovací velikosti */}
                    <Form.Group controlId="formTestSize">
                        <Form.Label>Test Size</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="0.5"
                            name="test_size"
                            value={datasetParams.test_size}
                            onChange={handleDatasetConfigChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formXNum">
                        <Form.Label>X number</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            name="x_num"
                            value={datasetParams.x_num}
                            onChange={handleDatasetConfigChange}
                        />
                    </Form.Group>

                    {/* Nastavení y_num */}
                    <Form.Group controlId="formYNum">
                        <Form.Label>Y number</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            name="y_num"
                            value={datasetParams.y_num}
                            onChange={handleDatasetConfigChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleClose}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};
