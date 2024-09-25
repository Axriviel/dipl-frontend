import React, { useState } from 'react';
import ModelVisualizer from './ModelVisualiser.tsx';
import { LayerConfig } from './LayerConfig.tsx';
import { useAuth } from '../../features/AuthContext/AuthContext.tsx';
import { configData } from '../../config/config.tsx';
import { Button } from 'react-bootstrap';
import { LayerParams } from './Models/LayerParams.tsx';


interface ModelParams {
  layers: LayerParams[];
}

export const ModelConfig: React.FC = () => {
  const { user } = useAuth();
  const [modelParams, setModelParams] = useState<ModelParams>({ layers: [] });
  const [newLayerType, setNewLayerType] = useState<string>('Dense');
  const [selectedLayer, setSelectedLayer] = useState<LayerParams | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const addLayer = () => {
    let newLayer: LayerParams;

    switch (newLayerType) {
      case 'Dense':
        newLayer = {
          id: Date.now().toString(),
          name: "dense",
          type: 'Dense',
          units: 32,
          unitsRandom:{
            min: 0,
            max: 0,
            type: "normal",
          },
          activation: 'relu',
          inputs: []
        };
        break;
      case 'Conv2D':
        newLayer = {
          id: Date.now().toString(),
          name: "conv2d",
          type: 'Conv2D',
          unitsRandom:{
            min: 0,
            max: 0,
            type: "normal",
          },
          filters: 64,
          kernel_size: [3, 3],
          activation: 'relu',
          inputs: []
        };
        break;
      // Přidávej další typy vrstev zde
      default:
        return;
    }

    setModelParams({ ...modelParams, layers: [...modelParams.layers, newLayer] });
  };

  const updateLayer = (index: number, updatedLayer: LayerParams) => {
    const newLayers = [...modelParams.layers];
    newLayers[index] = updatedLayer;
    setModelParams({ ...modelParams, layers: newLayers });
  };

  const handleLayerClick = (layer: LayerParams) => {
    setSelectedLayer(layer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLayer(null);
  };

  const handleSubmit = async () => {
    try {
      console.log(JSON.stringify({...modelParams, user}))
      const response = await fetch(`${configData.API_URL}/api/save-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...modelParams }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Model successfully sent to backend:', result);
    } catch (error) {
      console.error('Error sending model to backend:', error);
    }
  };

  return (
    <div className='m-2'>
      <div className='d-flex flex-column align-items-center'>
        <h2>Model Configuration</h2>

        <select value={newLayerType} onChange={(e) => setNewLayerType(e.target.value)}>
          <option value="Dense">Dense</option>
          <option value="Conv2D">Conv2D</option>
          {/* Přidej další typy vrstev zde */}
        </select>

        <Button onClick={addLayer}>Add Layer</Button>

        {modelParams.layers.map((layer, index) => (
          <Button
            key={layer.id}
            onClick={() => handleLayerClick(layer)}
            className="m-2"
            variant="primary"
          >
            {layer.type} Layer (ID: {layer.id})
          </Button>
        ))}

        <Button onClick={handleSubmit}>Submit Model</Button>

        <h3>Model Visualizer</h3>
      </div>

      <ModelVisualizer layers={modelParams.layers} />

      {selectedLayer && (
        <LayerConfig
          layer={selectedLayer}
          updateLayer={(updatedLayer) => updateLayer(modelParams.layers.findIndex(l => l.id === updatedLayer.id), updatedLayer)}
          allLayers={modelParams.layers}
          show={showModal}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};