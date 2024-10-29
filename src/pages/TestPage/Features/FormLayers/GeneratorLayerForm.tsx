import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { LayerParams } from '../../Models/LayerParams';
import { createDenseLayer } from '../Layers/CreateDenseLayer';
import { createConv2DLayer } from '../Layers/CreateConv2DLayer';
import { LayerConfig } from '../../LayerConfig';
import { IModelSettings } from '../../Models/ModelSettings';

interface GeneratorLayerFormProps {
  currentLayer: any;
  handleChange: (key: string, value: any) => void;
  updateModelParams: (updatedLayers?: LayerParams[], updatedSettings?: IModelSettings) => void;
}

export const GeneratorLayerForm: React.FC<GeneratorLayerFormProps> = ({
  currentLayer,
  handleChange,
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
