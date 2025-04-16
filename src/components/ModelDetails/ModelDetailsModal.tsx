import React from "react";
import { Accordion, Button, Modal } from "react-bootstrap";
import { HelpfulTip } from "../../features/Tooltip";

type ModalProps = {
    show: boolean;
    onClose: () => void;
    data: any;
};

const DataModal: React.FC<ModalProps> = ({ show, onClose, data }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Model Overview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                    <Accordion.Item eventKey="770">
                        <Accordion.Header className="d-flex">Used parameters<span className="flex-grow-1"></span> <HelpfulTip text="Contains all parameters which were used to create the model" /></Accordion.Header>
                        <Accordion.Body>
                            <Accordion flush>
                                {/* Model Params */}
                                {data.used_params[0] && Object.keys(data.used_params[0]).length > 0 && (
                                    <Accordion.Item eventKey="modelParams">
                                        <Accordion.Header className="d-flex">Model Params <span className="flex-grow-1"></span> <HelpfulTip text="Parameters which were used in the layers of the model (excluding generator layer and its structures)" /></Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                {Object.entries(data.used_params[0]).map(([key, value]) => (
                                                    <li key={key}>
                                                        <strong>{key}:</strong> {JSON.stringify(value)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )}

                                {/* Dataset Params */}
                                {data.used_params[1] && Object.keys(data.used_params[1]).length > 0 && (
                                    <Accordion.Item eventKey="datasetParams">
                                        <Accordion.Header className="d-flex">Config Params <span className="flex-grow-1"></span> <HelpfulTip text="Parameters which were used in model config" /></Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                {Object.entries(data.used_params[1]).map(([key, value]) => (
                                                    <li key={key}>
                                                        <strong>{key}:</strong> {JSON.stringify(value)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )}

                                {/* Generator Params */}
                                {data.used_params[2] && data.used_params[2].length > 0 &&
                                    data.used_params[2].map((gen: any, index: number) => (
                                        <Accordion.Item eventKey={`gen-${index}`} key={`gen-${index}`}>
                                            <Accordion.Header className="d-flex">Generator {index + 1} <span className="flex-grow-1"></span> <HelpfulTip text="Parameters which were used in the layers of the model (excluding generator layer and its structures)" /></Accordion.Header>
                                            <Accordion.Body>
                                                <div className="mb-2">
                                                    <strong>Layers sequence:</strong>
                                                    <pre>{JSON.stringify(gen.layers_sequence, null, 2)}</pre>
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Used layers:</strong>
                                                    <pre>{JSON.stringify(gen.used_layers, null, 2)}</pre>
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Used parameters:</strong>
                                                    <pre>{JSON.stringify(gen.used_parameters, null, 2)}</pre>
                                                </div>
                                                <div>
                                                    <strong>Used rules:</strong>
                                                    <pre>{JSON.stringify(gen.used_rules, null, 2)}</pre>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                            </Accordion>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="771">
                        <Accordion.Header className="d-flex">Creation config<span className="flex-grow-1"></span> <HelpfulTip text="Complete JSON structure which was used to create the model" /></Accordion.Header>
                        <Accordion.Body className="d-flex flex-column justify-content-center">
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default DataModal;
