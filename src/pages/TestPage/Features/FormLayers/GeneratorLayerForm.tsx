import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { LayerParams } from '../../Models/LayerParams';
import { createDenseLayer } from '../Layers/CreateDenseLayer';
import { createConv2DLayer } from '../Layers/CreateConv2DLayer';
import { LayerConfig, NumericRandomizers, RandomConfig } from '../../LayerConfig';
import { IModelSettings } from '../../Models/ModelSettings';
import { RandomizerSelect } from '../RandomizerSelect';

interface GeneratorLayerFormProps {
  currentLayer: any;
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

  // Přidání nové vrstvy do generátoru pomocí existujících funkcí
  const addLayerToGenerator = () => {
    let newLayer: LayerParams;
    switch (newLayerType) {
      case 'Dense':
        newLayer = createDenseLayer();
        break;
      case 'Conv2D':
        newLayer = createConv2DLayer();
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
          <div key={index} className="d-flex justify-content-between">
            <p>{layer.type} Layer (ID: {layer.id})</p>
            <Button variant="primary" onClick={() => handleLayerClick(layer)}>
              Edit Layer
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
          <option value="Dense">Dense</option>
          <option value="Conv2D">Conv2D</option>
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
