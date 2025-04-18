import React from 'react';
import { Accordion, Button, Modal, Table } from 'react-bootstrap';
import { ITaskProtocol } from '../../features/Models/models/TaskProtocol';
import "./ModelProtocolModal.css";

interface Props {
  modelName: string,
  data: ITaskProtocol;
  show: boolean;
  onClose: () => void;
}

export const ModelProtocolModal: React.FC<Props> = ({ modelName, data, show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} size='xl'>
      <Modal.Header closeButton>
        <Modal.Title>Model: {modelName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='overflow-auto'>
        <div>
          <strong>Used X columns:</strong>
          <ul>
            {data.x_columns.map(col => <li>{col}</li>) ?? "unknown"}
          </ul>
        </div>
        <div>
          <strong>Used Y columns:</strong>
          <ul>
            {data.y_columns.map(col => <li>{col}</li>) ?? "unknown"}
          </ul>
        </div>
        <div>
          <strong>One hot encoded X columns:</strong>
          {data.one_hot_encoded_x && data.one_hot_encoded_x.length > 0 ?
            <ul>
              {data.one_hot_encoded_x.map(col => <li>{col}</li>)}
            </ul>
            : " none encoded"}
        </div>
        <div>
          <strong>One hot encoded Y columns:</strong>
          {data.one_hot_encoded_y && data.one_hot_encoded_y.length > 0 ?
            <ul>
              {data.one_hot_encoded_y.map(col => <li>{col}</li>)}
            </ul>
            : " none encoded"}
        </div>
        {data.stopped_by &&
          <div>
            <strong>Stopped by</strong>
            {data.stopped_by ?? ""}
          </div>
        }
        <div>
          <strong>Started at:</strong> {data.started_at}
        </div>
        <div>
          <strong>Finished at:</strong> {data.finished_at}
        </div>
        <div>
          <strong>Growth limit function:</strong> {data.limit_growth}
        </div>
        <div className='mt-5'>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Epoch</th>
                <th>Model ID</th>
                <th>Timestamp</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {data.epochs.map((epoch: any, epochIndex: number) =>
                epoch.models.map((model: any, modelIndex: number) => (
                  <tr key={`${epochIndex}-${modelIndex}`}>
                    <td>{epoch.epoch_number}</td>
                    <td>{model.model_id ?? `model_${modelIndex}`}</td>
                    <td>{model.timestamp ?? "-"}</td>
                    <td>
                      {typeof model.results === 'number'
                        ? model.results.toFixed(3)
                        : JSON.stringify(model.results)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* {data.epochs.map((epoch: any, index: any) => (
          <div key={index}>
            <strong>Epoch {epoch.epoch_number}</strong>
            <p>{JSON.stringify(epoch)}</p>
          </div>
        ))} */}

        <Accordion defaultActiveKey="0" alwaysOpen>
          {data.epochs.map((epoch: any, epochIndex: number) => (
            <Accordion.Item eventKey={String(epochIndex)} key={epochIndex}>
              <Accordion.Header>
                <div className="d-flex flex-column">
                  <span><strong>Epoch {epoch.epoch_number}</strong></span>
                  <small className="text-muted">{epoch.timestamp}</small>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {/* Epoch model_info */}
                {epoch.model_info && Object.keys(epoch.model_info).length > 0 && (
                  <div className="mb-3">
                    <strong>Model Info:</strong>
                    <ul>
                      {Object.entries(epoch.model_info).map(([key, val]) => (
                        <li key={key}><strong>{key}:</strong> {JSON.stringify(val)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Epoch limits */}
                {epoch.limits && epoch.limits.length > 0 && (
                  <div className="mb-3">
                    <strong>Limits:</strong>
                    <ul>
                      <details>
                        <summary>Show all used limits</summary>
                        {epoch.limits.map((limit: any, idx: number) => (
                          <li key={idx}>
                            {Object.entries(limit).map(([k, v]) => (
                              <span key={k}><strong>{k}:</strong> {String(v)}&nbsp;</span>
                            ))}
                          </li>
                        ))}
                      </details>
                    </ul>
                  </div>
                )}

                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Model ID</th>
                      <th>Timestamp</th>
                      <th>Result</th>
                      <th>Layers</th>
                      <th>History</th>
                      <th>Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {epoch.models.map((model: any, modelIndex: number) => (
                      <tr key={modelIndex}>
                        <td>{model.model_id ?? `model_${modelIndex}`}</td>
                        <td>{model.timestamp ?? "-"}</td>
                        <td>
                          {typeof model.results === 'number'
                            ? model.results.toFixed(4)
                            : typeof model.results === 'object'
                              ? Object.entries(model.results).map(([k, v]) =>
                                <div key={k}><strong>{k}:</strong> {typeof v === 'number' ? v.toFixed(4) : JSON.stringify(v)}</div>)
                              : JSON.stringify(model.results)}
                        </td>
                        <td>
                          {model.architecture && model.architecture.length > 0 ? (
                            <details>
                              <summary>{model.architecture.length} layers</summary>
                              <ul className="mb-0">
                                {model.architecture.map((layer: any, i: number) => (
                                  <li key={i}>
                                    <strong>{layer.layer_type}</strong> ({layer.layer_name}) – {layer.num_params} params
                                    {layer.output_shape && <>{layer.neurons && (
                                      <em>- {layer.neurons} neurons</em>
                                    )}</>}
                                  </li>
                                ))}
                              </ul>
                            </details>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {model.history && model.history.length > 0 ? (
                            <details>
                              <summary>{model.history.length} epochs</summary>
                              <ul className="mb-0">
                                {model.history.map((entry: any, i: number) => (
                                  <li key={i}>
                                    <strong>Epoch {entry.epoch}:</strong>{" "}
                                    {entry.value !== undefined
                                      ? entry.value.toFixed(4)
                                      : `train: ${entry.train_value?.toFixed(4)}, val: ${entry.val_value?.toFixed(4)}`}
                                  </li>
                                ))}
                              </ul>
                            </details>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {model.parameters && Object.keys(model.parameters).length > 0 ? (
                            <details>
                              <summary>{Object.keys(model.parameters).length} parameters</summary>
                              <ul className="mb-0">
                                {Array.isArray(model.parameters) ? (
                                  <>
                                    {/* Parametry typu 0 */}
                                    {model.parameters[0] && Object.keys(model.parameters[0]).length > 0 && (
                                      <li>
                                        <strong>Model parameters:</strong>
                                        <ul>
                                          {Object.entries(model.parameters[0]).map(([key, value], i) => (
                                            <li key={`mp-${i}`}><strong>{key}:</strong> {JSON.stringify(value)}</li>
                                          ))}
                                        </ul>
                                      </li>
                                    )}

                                    {/* Parametry typu 1 */}
                                    {model.parameters[1] && Object.keys(model.parameters[1]).length > 0 && (
                                      <li>
                                        <strong>Training parameters:</strong>
                                        <ul>
                                          {Object.entries(model.parameters[1]).map(([key, value], i) => (
                                            <li key={`tp-${i}`}><strong>{key}:</strong> {JSON.stringify(value)}</li>
                                          ))}
                                        </ul>
                                      </li>
                                    )}

                                    {/* Parametry typu 2 */}
                                    {model.parameters[2] && Array.isArray(model.parameters[2]) && model.parameters[2].length > 0 && (
                                      <li>
                                        <strong>Generator config:</strong>
                                        <ul>
                                          {model.parameters[2].map((gen: any, gi: number) => (
                                            <li key={`gen-${gi}`}>
                                              <details>
                                                <summary>Generator {gi + 1}</summary>
                                                <ul>
                                                  <li><strong>Layers sequence:</strong> {JSON.stringify(gen.layers_sequence)}</li>
                                                  <li><strong>Used layers:</strong>
                                                    <pre className="">{JSON.stringify(gen.used_layers, null, 2)}</pre>
                                                  </li>
                                                  <li><strong>Used parameters:</strong>
                                                    <pre className="">{JSON.stringify(gen.used_parameters, null, 2)}</pre>
                                                  </li>
                                                  <li><strong>Used rules:</strong>
                                                    <pre className="">{JSON.stringify(gen.used_rules, null, 2)}</pre>
                                                  </li>
                                                </ul>
                                              </details>
                                            </li>
                                          ))}
                                        </ul>
                                      </li>
                                    )}
                                  </>
                                ) : (
                                  Object.entries(model.parameters).map(([key, value], idx) => (
                                    <li key={idx}><strong>{key}:</strong> {JSON.stringify(value)}</li>
                                  ))
                                )}

                              </ul>
                            </details>
                          ) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
