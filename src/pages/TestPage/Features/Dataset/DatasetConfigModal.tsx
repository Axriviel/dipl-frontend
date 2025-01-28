import React, { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
// import { configData } from '../../../../config/config';
import { IDatasetConfig } from '../../Models/DatasetConfig';

interface DatasetConfigModalProps {
    datasetParams: IDatasetConfig;
    setDatasetConfig: (newConfig: Partial<IDatasetConfig>) => void;
    show: boolean;
    handleClose: () => void;
}

export const DatasetConfigModal: React.FC<DatasetConfigModalProps> = ({ datasetParams, setDatasetConfig, show, handleClose }) => {
    // const [columnNames, setColumnNames] = useState<string[]>([]); // Seznam názvů sloupců

    // Funkce pro načtení sloupců z datasetu po nahrání
    // const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     const formData = new FormData();
    //     formData.append("file", file);

    //     const response = await fetch(`${configData.API_URL}/api/get_column_names`, {
    //         method: "POST",
    //         credentials: "include",
    //         body: formData,
    //     });
    //     const data = await response.json();
    //     setColumnNames(data); // Nastavení názvů sloupců
    //     setDatasetConfig({ file });
    // };

    // // Výběr vstupních sloupců (X)
    // const handleXColumnsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    //     const selectedColumns = Array.from(e.target.selectedOptions, option => option.value);
    //     setModelParams(prev => ({
    //         ...prev,
    //         datasetConfig: {
    //             ...prev.datasetConfig,
    //             x_columns: selectedColumns
    //         },
    //         inputLayer: {
    //             ...prev.inputLayer,
    //             shape: [selectedColumns.length]
    //         }
    //     }));
    // };

    // // Výběr výstupního sloupce (Y)
    // const handleYColumnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    //     setModelParams(prev => ({
    //         ...prev,
    //         datasetConfig: {
    //             ...prev.datasetConfig,
    //             y_column: e.target.value
    //         }
    //     }));
    // };

    //handle change
    const handleDatasetConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = parseFloat(value);

        setDatasetConfig({ [name]: numericValue });
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
                    {/* <Form.Group controlId="formXColumns">
                        <Form.Label>Input Columns (X)</Form.Label>
                        <Form.Control as="select" multiple>
                            {columnNames.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </Form.Control>
                    </Form.Group> */}

                    {/* Výběr sloupce pro výstup Y */}
                    {/* <Form.Group controlId="formYColumn">
                        <Form.Label>Output Column (Y)</Form.Label>
                        <Form.Control as="select">
                            {columnNames.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </Form.Control>
                    </Form.Group> */}

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
