import React from "react";
import { Modal, Button, Accordion, Card } from "react-bootstrap";
import { DownloadJSON } from "../../features/Models/DownloadJSON";
import { HelpfulTip } from "../../features/Tooltip";
import Tippy from "@tippyjs/react";

type ModalProps = {
    show: boolean;
    onClose: () => void;
    data: any;
};

const DataModal: React.FC<ModalProps> = ({ show, onClose, data }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Data Overview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center mb-1">
                    <Tippy content="Downloads this model in JSON format, which can be uploaded in custom designer to further work with it">
                        <Button className="mx-1" onClick={DownloadJSON(data)}>Download JSON</Button>
                    </Tippy>
                </div>
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
