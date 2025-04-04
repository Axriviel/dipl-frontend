import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
// import { configData } from '../../../../config/config';
import { IDatasetConfig } from '../../Models/DatasetConfig';
import { IModelParams } from '../../Models/ModelParams';
import { IAutoTaskState } from '../../../AutoDesignPage/Models/AutoTask';
import { HelpfulTip } from '../../../../features/Tooltip';
import { getDatasetColumns } from '../../../../features/Datasets/GetDatasetColumns';

interface DatasetConfigModalProps {
    datasetName: string;
    datasetParams: IDatasetConfig;
    isDefaultDataset?: boolean;
    setDatasetConfig: React.Dispatch<React.SetStateAction<IModelParams | IAutoTaskState>>;
    show: boolean;
    handleClose: () => void;
}

export const DatasetConfigModal: React.FC<DatasetConfigModalProps> = ({ datasetName, isDefaultDataset, datasetParams, setDatasetConfig, show, handleClose }) => {
    const [columnNames, setColumnNames] = useState<string[]>([]); // Seznam názvů sloupců
    const [datasetColumnsLoading, setDatasetColumnsLoading] = useState<boolean>(true)
    const [selectedXColumns, setSelectedXColumns] = useState<string[]>([]);
    const [selectedYColumns, setSelectedYColumns] = useState<string[]>([]);
    const [oneHotEncodeX, setOneHotEncodeX] = useState<string[]>([]);
    const [oneHotEncodeY, setOneHotEncodeY] = useState<string[]>([]);
    const [showOneHotEncodeX, setShowOneHotEncodeX] = useState<boolean>(false);
    const [showOneHotEncodeY, setShowOneHotEncodeY] = useState<boolean>(false);

    // Synchronizace výběru při otevření modalu
    useEffect(() => {
        console.log("effect")
        if (datasetParams?.x_columns) {
            setSelectedXColumns(datasetParams.x_columns);
        }
        if (datasetParams?.y_columns) {
            setSelectedYColumns(datasetParams.y_columns);
        }
    }, [datasetParams, show]);

    // Funkce pro načtení sloupců z datasetu po nahrání
    useEffect(() => {
        if (!datasetName) return;
        setDatasetColumnsLoading(true);

        getDatasetColumns(datasetName, isDefaultDataset)
            .then(columns => {
                if (columns) {
                    setColumnNames(columns);
                }
                setDatasetColumnsLoading(false);
            })
            .catch(() => setDatasetColumnsLoading(false)); // Ošetření chyby
    }, [datasetName]);

    const handleOneHotColumnsChange = (
        e: ChangeEvent<HTMLSelectElement>,
        target: 'one_hot_x_columns' | 'one_hot_y_columns'
    ) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);

        // Lokální set podle targetu
        if (target === 'one_hot_x_columns') {
            setOneHotEncodeX(selected);
        } else {
            setOneHotEncodeY(selected);
        }

        // Zápis do datasetConfig
        setDatasetConfig(prev => ({
            ...prev,
            datasetConfig: {
                ...prev.datasetConfig,
                [target]: selected
            }
        }));
    };
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
        const selectedColumns = Array.from(e.target.selectedOptions, option => option.value);
        setDatasetConfig(prev => ({
            ...prev,
            datasetConfig: {
                ...prev.datasetConfig,
                y_columns: selectedColumns
            }
        }));
    };

    //handle change
    const handleDatasetConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = parseFloat(value);

        setDatasetConfig(prev => ({
            ...prev,
            datasetConfig: {
                ...prev.datasetConfig, // Zachováme všechny ostatní hodnoty v `datasetConfig`
                [name]: numericValue // Aktualizujeme konkrétní hodnotu (např. `x_num`, `y_num`)
            }
        }));
    };


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Dataset Configuration</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='custom-form'>
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
                    <Form.Group controlId="formXColumn">
                        <Form.Label className='font-weight-600'>Input columns (X)</Form.Label>

                        <Form.Select as="select" multiple onChange={handleXColumnsChange} value={selectedXColumns}>
                            {!datasetColumnsLoading ? (
                                columnNames.map((col, index) => (
                                    <option key={index} value={col}>{col}</option>
                                ))
                            ) : (
                                <option disabled value={""}>{"Loading ..."}</option>
                            )}
                        </Form.Select>
                    </Form.Group>

                    {/* Výběr sloupce pro výstup Y */}
                    <Form.Group controlId="formYColumn">
                        <Form.Label className='font-weight-600'>Output Column (Y)</Form.Label>
                        <Form.Select as="select" multiple onChange={handleYColumnChange} value={selectedYColumns}>
                            {!datasetColumnsLoading ? (
                                columnNames.map((col, index) => (
                                    <option key={index} value={col}>{col}</option>
                                ))
                            ) : (
                                <option disabled value={""}>{"Loading ..."}</option>
                            )}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Specify one-hot encoding for X"
                            checked={showOneHotEncodeX}
                            onChange={(e) => setShowOneHotEncodeX(e.target.checked)}
                            className="mb-2"
                        />
                        <Form.Check
                            type="checkbox"
                            label="Specify one-hot encoding for Y"
                            checked={showOneHotEncodeY}
                            onChange={(e) => setShowOneHotEncodeY(e.target.checked)}
                        />
                    </Form.Group>

                    {showOneHotEncodeX &&
                        <Form.Group controlId="formOneHotX">
                            <Form.Label className='font-weight-600'>
                                X columns to one-hot encode <HelpfulTip text="Usually categorical columns in input. Hold Ctrl or Cmd to select multiple." />
                            </Form.Label>
                            <Form.Select as="select" multiple onChange={(e) => handleOneHotColumnsChange(e, 'one_hot_x_columns')} value={oneHotEncodeX}>
                                {!datasetColumnsLoading ? (
                                    <>
                                        {selectedXColumns.map((col, index) => (
                                            <option key={index} value={col}>{col}</option>
                                        ))}
                                    </>
                                ) : (
                                    <option disabled value={""}>{"Loading ..."}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    }
                    {showOneHotEncodeY &&
                        <Form.Group controlId="formOneHotY">
                            <Form.Label className='font-weight-600'>
                                Y columns to one-hot encode <HelpfulTip text="Usually categorical columns in output. Hold Ctrl or Cmd to select multiple." />
                            </Form.Label>
                            <Form.Select as="select" multiple onChange={(e) => handleOneHotColumnsChange(e, 'one_hot_y_columns')} value={oneHotEncodeY}>
                                {!datasetColumnsLoading ? (
                                    <>
                                        {selectedYColumns.map((col, index) => (
                                            <option key={index} value={col}>{col}</option>
                                        ))}
                                    </>
                                ) : (
                                    <option disabled value={""}>{"Loading ..."}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    }

                    {/* Nastavení testovací velikosti */}
                    <Form.Group controlId="formTestSize">
                        <Form.Label className='font-weight-600'>Test Size <HelpfulTip text='Sets trainTestSplit ratio (e.g. 0.2 selects 20% data as testing and 80% as training)' /></Form.Label>
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

                    {/* <p className='mt-2'>Alternative if you have your columns ordered:</p>
                    <Form.Group controlId="formXNum">
                        <Form.Label className='font-weight-600'>X col number <HelpfulTip text='Number of input columns from 0 to N (e.g. 4 selects columns 0, 1, 2, 3)' /></Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            name="x_num"
                            value={datasetParams.x_num}
                            onChange={handleDatasetConfigChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formYNum">
                        <Form.Label className='font-weight-600'>Y col number <HelpfulTip text='Number of output column. (e.g. 4 selects column 3 as output (counted from 0))' /></Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            name="y_num"
                            value={datasetParams.y_num}
                            onChange={handleDatasetConfigChange}
                        />
                    </Form.Group> */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleClose}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};
