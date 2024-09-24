import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Modal, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import { activationFunctions } from '../../features/ModelLayers/Activations';
import { LayerParams } from './Models/LayerParams';

interface LayerConfigProps {
  layer: LayerParams;
  updateLayer: (updatedLayer: LayerParams) => void;
  allLayers: LayerParams[];
  show: boolean;
  handleClose: () => void;
}

export const LayerConfig: React.FC<LayerConfigProps> = ({ layer, updateLayer, allLayers, show, handleClose }) => {
  const [currentLayer, setCurrentLayer] = useState<LayerParams>(layer);

  useEffect(() => {
    setCurrentLayer(layer);
  }, [layer]);

  const handleSave = () => {
    updateLayer(currentLayer)
    handleClose()
  }
  const handleChange = (key: string, value: any) => {
    setCurrentLayer(prevLayer => ({ ...prevLayer, [key]: value }));
    //updateLayer({ ...currentLayer, [key]: value });
  };

  const handleInputsChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setCurrentLayer(prevLayer => ({ ...prevLayer, inputs: selectedOptions }));
    //updateLayer({ ...currentLayer, inputs: selectedOptions });
  };

  const handleActivationChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLayer(prevLayer => ({ ...prevLayer, activation: e.target.value }));
    //updateLayer({ ...layer, activation: e.target.value });
  };

  const InputsConst = (
    <Form.Group controlId={`inputs-${currentLayer.id}`}>
      <Form.Label>Inputs:</Form.Label>
      <Form.Control
        as="select"
        multiple
        value={currentLayer.inputs}
        onChange={handleInputsChange}
      >
        {allLayers.filter(l => l.id !== currentLayer.id).map(l => (
          <option key={l.id} value={l.id}>{l.type} (ID: {l.id})</option>
        ))}
      </Form.Control>
    </Form.Group>
  );

  const renderLayerSpecificFields = () => {
    switch (currentLayer.type) {
      case 'Dense':
        return (
          <>
            <Form.Group controlId={`units-${currentLayer.id}`}>
              <Form.Label>Units:</Form.Label>
              {/* tohle není asi úplně správná cesta */}
              {currentLayer.units}
              {currentLayer.units !== 0 ?
                <Form.Control
                  type="number"
                  value={currentLayer.units || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('units', parseInt(e.target.value))}
                />
                :
                <>
                  <Form.Control
                   type="string"
                    value={currentLayer.unitsRandom.type}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unitsRandom.type', (e.target.value))}
                  />
                  <Form.Control type="number"
                    value={currentLayer.unitsRandom.min}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unitsRandom.min', (e.target.value))}
                  />
                  <Form.Control type="number"
                    value={currentLayer.unitsRandom.max}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unitsRandom.max', (e.target.value))}
                  />
                </>
              }
            </Form.Group>

            <Form.Group controlId={`activation-${currentLayer.id}`}>
              <Form.Label>Activation:</Form.Label>
              <Form.Control
                as="select"
                value={currentLayer.activation || ''}
                onChange={handleActivationChange}
              >
                {activationFunctions.map(fn => (
                  <option key={fn} value={fn}>{fn}</option>
                ))}
              </Form.Control>
            </Form.Group>
            {InputsConst}
          </>
        );
      case 'Conv2D':
        return (
          <>
            <Form.Group controlId={`filters-${currentLayer.id}`}>
              <Form.Label>Filters:</Form.Label>
              <Form.Control
                type="number"
                value={currentLayer.filters || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('filters', parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group controlId={`kernelSize-${currentLayer.id}`}>
              <Form.Label>Kernel Size:</Form.Label>
              <Form.Control
                type="text"
                value={currentLayer.kernel_size ? currentLayer.kernel_size.join(',') : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('kernel_size', e.target.value.split(',').map(Number))}
              />
            </Form.Group>
            {InputsConst}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{currentLayer.type} Layer (ID: {currentLayer.id})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup controlId={`id-${currentLayer.id}`}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={currentLayer.name || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
          />
        </FormGroup>
        {renderLayerSpecificFields()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleClose}>
          Exit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
