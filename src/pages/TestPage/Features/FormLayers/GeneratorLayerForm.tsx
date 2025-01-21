import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { LayerParams } from '../../Models/LayerParams';
import { createDenseLayer } from '../Layers/CreateDenseLayer';
import { createConv2DLayer } from '../Layers/CreateConv2DLayer';
import { LayerConfig, NumericRandomizers, RandomConfig } from '../../LayerConfig';
import { IModelSettings } from '../../Models/ModelSettings';
import { RandomizerSelect } from '../RandomizerSelect';
import { IGeneratorLayer } from '../../Models/GeneratorLayers';
import { createGeneratorLayer } from '../Layers/CreateGeneratorLayer';
import { createDropoutLayer } from '../Layers/CreateDropoutLayer';
import { createMaxPooling2DLayer } from '../Layers/CreateMaxPooling2DLayer';
import { createLSTMLayer } from '../Layers/CreateLSTMLayer';
import { createFlattenLayer } from '../Layers/CreateFlattenLayer';
import { createInputLayer } from '../Layers/CreateInputLayer';
import "./GeneratorLayerForm.css"

interface GeneratorLayerFormProps {
  currentLayer: IGeneratorLayer;
  handleChange: (key: string, value: any) => void;
  handleRandomToggle: (key: string, type: string) => void;
  renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
  updateModelParams: (updatedLayers?: LayerParams[], updatedSettings?: IModelSettings) => void;
}

export const GeneratorLayerForm: React.FC<GeneratorLayerFormProps> = ({
  currentLayer,
  handleChange,
  handleRandomToggle,
  renderRandomConfig,
  updateModelParams,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<LayerParams | null>(null);
  const [showLayerConfig, setShowLayerConfig] = useState<boolean>(false);
  const [newLayerType, setNewLayerType] = useState<string>('Dense');

  const selectableLayers = [
    { id: 1, name: 'Dense' },
    { id: 2, name: 'Conv2D' },
    { id: 3, name: 'Input' },
    // { id: 4, name: 'Generator' },
    { id: 5, name: 'Dropout' },
    { id: 6, name: 'MaxPooling2D' },
    { id: 7, name: "Flatten" },
    { id: 8, name: "LSTM" }
  ];

  const removeLayerFromGenerator = (layerId: string) => {
    const updatedLayers = currentLayer.possibleLayers.filter(
      (layer: LayerParams) => layer.id !== layerId
    );
    handleChange('possibleLayers', updatedLayers);
  };

  // Přidání nové vrstvy do generátoru pomocí existujících funkcí
  const addLayerToGenerator = () => {
    let newLayer: LayerParams;
    switch (newLayerType) {
      case "Input":
        newLayer = createInputLayer();
        break;
      case 'Dense':
        newLayer = createDenseLayer();
        console.log(newLayer)
        break;
      case 'Conv2D':
        newLayer = createConv2DLayer();
        break;
      case 'Generator':
        newLayer = createGeneratorLayer();
        break;
      case 'Dropout':
        newLayer = createDropoutLayer();
        break;
      case 'MaxPooling2D':
        newLayer = createMaxPooling2DLayer();
        break;
      case 'LSTM':
        newLayer = createLSTMLayer();
        break;
      case 'Flatten':
        newLayer = createFlattenLayer();
        break;
      default:
        return;
    }

    // Uložíme novou vrstvu do generátoru
    handleChange('possibleLayers', [...currentLayer.possibleLayers, newLayer]);
  };

  // Umožní úpravu existující vrstvy pomocí LayerConfig
  const handleLayerClick = (layer: LayerParams) => {
    setSelectedLayer(layer);
    setShowLayerConfig(true);
  };

  return (
    <>
      <Form.Group>
        <Form.Label>Number of generated layers</Form.Label>
        <RandomizerSelect
          value={currentLayer.sizeRandom ? currentLayer.sizeRandom.type : 'value'}
          onChange={(selectedType: string) => handleRandomToggle('size', selectedType)}
          options={NumericRandomizers} // Můžeš předat jakýkoliv seznam možností
        />
        {renderRandomConfig('size', currentLayer.sizeRandom)}
        {!currentLayer.sizeRandom && (
          <Form.Control
            type="number"
            value={currentLayer.size || 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('size', parseInt(e.target.value))}
          />
        )}
      </Form.Group>

      <h4>Define possible layers for generator</h4>

      {/* Seznam vrstev v generátoru */}
      {currentLayer.possibleLayers && currentLayer.possibleLayers.length > 0 ? (
        currentLayer.possibleLayers.map((layer: LayerParams, index: number) => (
          <div key={index} className="d-flex justify-content-between align-items-center generator-layers-table">
            <p className='flex-grow-1 my-0'>{layer.type} Layer (ID: {layer.id})</p>
            <Button
              variant="danger"
              onClick={() => removeLayerFromGenerator(layer.id)}
              className='mx-2'
            >
              Remove
            </Button>
            <Button variant="primary" onClick={() => handleLayerClick(layer)}>
              Edit
            </Button>
          </div>
        ))
      ) : (
        <p>No layers defined yet</p>
      )}

      {/* Výběr typu vrstvy a tlačítko pro přidání */}
      <Form.Group>
        <Form.Label>Add a layer to generator</Form.Label>
        <Form.Control
          as="select"
          value={newLayerType}
          onChange={(e) => setNewLayerType(e.target.value)}
        >
          {selectableLayers.map((layer) => (
            <option key={layer.id} value={layer.name}>
              {layer.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button onClick={addLayerToGenerator}>Add Layer</Button>

      {/* přidat možnost náhodnosti */}
      {/* Výběr první vrstvy */}
      <Form.Group>
        <Form.Label>Set first layer</Form.Label>
        <Form.Control
          as="select"
          value={currentLayer.firstLayer || ""}
          onChange={(e) => handleChange('firstLayer', e.target.value)}
        >
          <option value="">Select a layer</option>
          {currentLayer.possibleLayers.map((layer: LayerParams) => (
            <option key={layer.id} value={layer.id}>
              {layer.name} (ID: {layer.id})
            </option>
          ))}
        </Form.Control>
      </Form.Group>


      {/* Pokud je vybraná vrstva, zobrazíme modální okno s LayerConfig */}
      {selectedLayer && (
        <LayerConfig
          layer={selectedLayer}
          isGenerator={true}
          updateLayer={(updatedLayer) => {
            const updatedLayers = currentLayer.possibleLayers.map((l: LayerParams) =>
              l.id === updatedLayer.id ? updatedLayer : l
            );
            handleChange('possibleLayers', updatedLayers);
            setShowLayerConfig(false);
          }}
          allLayers={currentLayer.possibleLayers}
          updateModelParams={updateModelParams}
          show={showLayerConfig}
          handleClose={() => setShowLayerConfig(false)}
        />
      )}
    </>
  );
};
