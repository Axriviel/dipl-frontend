import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import Tippy from '@tippyjs/react';
import { ITaskProtocol } from '../../features/Models/models/TaskProtocol';
import "./ModelProtocolModal.css"

interface Props {
  modelName: string,
  data: ITaskProtocol;
  show: boolean;
  onClose: () => void;
}

export const ModelProtocolModal: React.FC<Props> = ({ modelName, data, show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} size='lg'>
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
        <div>
          <strong>Started at:</strong> {data.started_at}
        </div>
        <div>
          <strong>Finished at:</strong> {data.finished_at}
        </div>
        <div>
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

        {data.epochs.map((epoch: any, index: any) => (
          <div key={index}>
            <strong>Epoch {epoch.epoch_number}</strong>
            <p>{JSON.stringify(epoch)}</p>
          </div>
        ))}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
