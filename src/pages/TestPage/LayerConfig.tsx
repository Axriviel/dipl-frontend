import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Modal } from 'react-bootstrap';
import { BatchNormalizationLayerForm } from './Features/FormLayers/BatchNormLayerForm';
import { Conv2DLayerForm } from './Features/FormLayers/Conv2DLayerForm';
import { DenseLayerForm } from './Features/FormLayers/DenseLayerForm';
import { DropoutLayerForm } from './Features/FormLayers/DropoutLayerForm';
import { FlattenLayerForm } from './Features/FormLayers/FlattenLayerForm';
import { GeneratorLayerForm } from './Features/FormLayers/GeneratorLayerForm';
import { InputLayerForm } from './Features/FormLayers/InputLayerForm';
import { LSTMLayerForm } from './Features/FormLayers/LSTMLayerForm';
import { MaxPooling2DLayerForm } from './Features/FormLayers/MaxPooling2DLayerForm';
import { IBatchNormalizationLayer } from './Models/BatchNormLayer';
import { IConv2DLayer } from './Models/Conv2DLayer';
import { IDenseLayer } from './Models/DenseLayer';
import { IDropoutLayer } from './Models/DropoutLayer';
import { IFlattenLayer } from './Models/FlattenLayer';
import { IGeneratorLayer } from './Models/GeneratorLayers';
import { IInputLayer } from './Models/InputLayer';
import { LayerParams } from './Models/LayerParams';
import { ILSTM } from './Models/LSTM';
import { IMaxPooling2D } from './Models/MaxPooling2D';
import { IModelSettings } from './Models/ModelSettings';
import { HelpfulTip } from '../../features/Tooltip';




//using generic type T so i can work with interfaces for specific layers. If not defined, use LayerParams
interface LayerConfigProps<T extends LayerParams = LayerParams> {
  layer: T;
  isGenerator: boolean | undefined;
  updateLayer: (updatedLayer: T) => void;
  handleDelete?: (id: string) => void;
  allLayers: LayerParams[];
  show: boolean;
  updateModelParams: (updatedLayers?: LayerParams[], updatedSettings?: IModelSettings) => void;
  handleClose: () => void;
}

export const LayerConfig: React.FC<LayerConfigProps> = ({ layer, isGenerator, updateLayer, handleDelete, allLayers, show, updateModelParams, handleClose }) => {
  const [currentLayer, setCurrentLayer] = useState<LayerParams>(layer);

  useEffect(() => {
    setCurrentLayer(layer);
  }, [layer]);

  const handleSave = () => {
    updateLayer(currentLayer);
    handleClose();
  };

  const handleDeleteClick = () => {
    handleDelete!(currentLayer.id);
    handleClose();
  };

  const handleChange = (key: string, value: any) => {
    console.log(`Updating ${key} to`, value);

    setCurrentLayer((prevLayer) => {
      if (key.includes("Random")) {
        const [randomKey, property] = key.split('.');

        const randomConfig = prevLayer[randomKey] || {}; // Inicializace randomConfig, if it does not exist

        const updatedRandomConfig = {
          ...randomConfig,
          [property]: value, // update specific key (e.g. options)
        };

        const updatedLayer = {
          ...prevLayer,
          [randomKey]: updatedRandomConfig,
        };

        return updatedLayer;
      }

      return { ...prevLayer, [key]: value };
    });
  };

  //toggle random for a parameter and creates default values based on randomization type
  const handleRandomToggle = (key: string, type: string) => {
    setCurrentLayer((prevLayer) => {
      const randomEnabled = prevLayer.hasOwnProperty(`${key}Random`);

      if (type === 'value') {
        return {

          ...prevLayer,
          [`${key}Random`]: undefined,
        };
      }

      return {
        ...prevLayer,
        [`${key}Random`]: randomEnabled
          ? (() => {
            switch (type) {
              case 'numeric':
                return { type: 'numeric', min: 1, max: 100, step: 1 };

              case 'numeric-test':
                return { type: 'numeric-test', min: 1, max: 100 };

              case 'text':
                return { type: 'text', options: ['option1', 'option2'] };

              default:
                throw new Error(`Unsupported type: ${type}`);
            }
          })()
          : undefined
      };
    });
  };




  const handleInputsChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setCurrentLayer((prevLayer) => ({ ...prevLayer, inputs: selectedOptions }));
  };

  const handleActivationChange: ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLayer((prevLayer) => ({ ...prevLayer, activation: e.target.value }));
  };

  const InputsConst = (
    <Form.Group controlId={`inputs-${currentLayer.id}`}>

      <Form.Label> {isGenerator ? "Possible follows:" : "Inputs:"}
        <HelpfulTip text={isGenerator ? "Layers which can follow the currently selected one" : "Which layer leads into the currently selected one"} />
      </Form.Label>
      <Form.Control
        as="select"
        multiple
        value={currentLayer.inputs}
        onChange={handleInputsChange}
      >
        {/* generator layer followup can have itself, regular layer can not */}
        {isGenerator ?
          allLayers.map(l => (
            <option key={l.id} value={l.id}>{l.type} (ID: {l.id})</option>
          ))
          :
          allLayers.filter(l => l.id !== currentLayer.id).map(l => (
            <option key={l.id} value={l.id}>{l.type} (ID: {l.id})</option>
          ))
        }

      </Form.Control>
    </Form.Group>
  );

  const renderLayerSpecificFields = () => {
    switch (currentLayer.type) {
      case 'Dense':
        return (
          <DenseLayerForm
            currentLayer={currentLayer as IDenseLayer}
            handleChange={handleChange}
            handleRandomToggle={handleRandomToggle}
            // renderRandomConfig={renderRandomConfig}
            InputsConst={InputsConst}
            handleActivationChange={handleActivationChange}
          />
        );
      case 'Conv2D':
        return (
          <Conv2DLayerForm
            currentLayer={currentLayer as IConv2DLayer}
            handleChange={handleChange}
            handleRandomToggle={handleRandomToggle}
            // renderRandomConfig={renderRandomConfig}
            InputsConst={InputsConst}
          />
        );
      case "Input":
        return (
          <InputLayerForm
            currentLayer={currentLayer as IInputLayer}
            handleChange={handleChange}
          />
        );
      case 'Generator':
        return (
          <>
            <GeneratorLayerForm
              currentLayer={currentLayer as IGeneratorLayer}
              handleChange={handleChange}
              handleRandomToggle={handleRandomToggle}
              // renderRandomConfig={renderRandomConfig}
              updateModelParams={updateModelParams}
            />
            {InputsConst}
          </>
        );
      case 'Dropout':
        return (
          <DropoutLayerForm
            currentLayer={currentLayer as IDropoutLayer}
            handleChange={handleChange}
            handleRandomToggle={handleRandomToggle}
            // renderRandomConfig={renderRandomConfig}
            InputsConst={InputsConst}
          />
        );
      case 'MaxPooling2D':
        return (
          <MaxPooling2DLayerForm
            currentLayer={currentLayer as IMaxPooling2D}
            handleChange={handleChange}
            InputsConst={InputsConst}
          />
        );
      case 'Flatten':
        return (
          <FlattenLayerForm
            currentLayer={currentLayer as IFlattenLayer}
            handleChange={handleChange}
            InputsConst={InputsConst}
          />
        );
      case 'LSTM':
        return (
          <LSTMLayerForm
            currentLayer={currentLayer as ILSTM}
            handleChange={handleChange}
            handleRandomToggle={handleRandomToggle}
            // renderRandomConfig={renderRandomConfig}
            InputsConst={InputsConst}
          />
        );
      case 'BatchNormalization':
        return (
          <BatchNormalizationLayerForm
            currentLayer={currentLayer as IBatchNormalizationLayer}
            handleChange={handleChange}
            handleRandomToggle={handleRandomToggle}
            // renderRandomConfig={renderRandomConfig}
            InputsConst={InputsConst}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal size='lg' show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{currentLayer.type} Layer (ID: {currentLayer.id})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className="pb-2" controlId={`id-${currentLayer.id}`}>
          <Form.Label className='font-weight-600'>Name <HelpfulTip text="Name of the layer which you can see in the designer" /></Form.Label>
          <Form.Control
            type="text"
            value={currentLayer.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
          />
        </FormGroup>
        {renderLayerSpecificFields()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSave}>
          Save
        </Button>
        {/* replace with icon */}
        {isGenerator ? undefined :
          <Button variant='secondary' onClick={handleDeleteClick}>
            Delete
          </Button>
        }
        <Button variant="secondary" onClick={handleClose}>
          Exit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
