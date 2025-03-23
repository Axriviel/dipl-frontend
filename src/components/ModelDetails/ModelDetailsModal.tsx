import React from "react";
import { Accordion, Button, Modal } from "react-bootstrap";

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
                        <Accordion.Header>Used Params</Accordion.Header>
                        <Accordion.Body>
                            <Accordion>
                                <Accordion.Item eventKey="690">
                                    <Accordion.Header>Model Params</Accordion.Header>
                                    <Accordion.Body>
                                        <pre>{JSON.stringify(data.used_params[0], null, 2)}</pre>
                                    </Accordion.Body>
                                </Accordion.Item>
                                {data.used_params[1] && Object.keys(data.used_params[1]).length > 0 && (
                                    <Accordion.Item eventKey="580">
                                        <Accordion.Header>Dataset params:</Accordion.Header>
                                        <Accordion.Body className="d-flex flex-column justify-content-center">
                                            <pre>{JSON.stringify(data.used_params[1], null, 2)}</pre>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )}

                                {data.used_params[2] && data.used_params[2].length > 0 &&
                                    data.used_params[2].map((item: any, index: any) => (
                                        <Accordion.Item eventKey={index.toString()} key={index}>
                                            <Accordion.Header>Generator params {index + 1}</Accordion.Header>
                                            <Accordion.Body className="d-flex flex-column justify-content-center">
                                                <pre>{JSON.stringify(item, null, 2)}</pre>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))
                                }
                            </Accordion>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="771">
                        <Accordion.Header>Creation Config</Accordion.Header>
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
