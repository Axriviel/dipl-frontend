import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { IModelStructureData } from './Models/ModelStructureData';

interface Props {
  modelName: string,
  data: IModelStructureData;
  show: boolean;
  onClose: () => void;
}

export const ModelStructureModal: React.FC<Props> = ({ modelName, data, show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Model: {modelName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='overflow-auto'>
        <Table striped bordered hover>
          <thead className='text-center'>
            <tr>
              <th>Layer</th>
              <th>Type</th>
              <th>Parameters</th>
              <th>Trainable</th>
            </tr>
          </thead>
          <tbody>
            {data.layers.map((layer, index) => (
              <tr key={index} className=''>
                <td>{layer.layer_name}</td>
                <td>{layer.layer_type}</td>
                <td>{layer.num_params}</td>
                <td>{layer.trainable ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
