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
        <p>
          <strong>Used X columns:</strong>
          <ul>
            {data.x_columns.map(col => <li>{col}</li>) ?? "unknown"}
          </ul>
        </p>
        <p>
          <strong>Used Y columns:</strong>
          <ul>
            {data.y_columns.map(col => <li>{col}</li>) ?? "unknown"}
          </ul>
        </p>
        <p>
          <strong>One hot encoded X columns:</strong>
          {data.one_hot_encoded_x && data.one_hot_encoded_x.length > 0 ?
            <ul>
              {data.one_hot_encoded_x.map(col => <li>{col}</li>)}
            </ul>
            : " none encoded"}
        </p>
        <p>
          <strong>One hot encoded Y columns:</strong>
          {data.one_hot_encoded_y && data.one_hot_encoded_y.length > 0 ?
            <ul>
              {data.one_hot_encoded_y.map(col => <li>{col}</li>)}
            </ul>
            : " none encoded"}
        </p>
        <p>
          <strong>Started at:</strong> {data.started_at}
        </p>
        <p>
          <strong>Finished at:</strong> {data.finished_at}
        </p>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
