import React, { useState } from 'react';
import ModelVisualizer from './ModelVisualiser.tsx';
import { LayerConfig } from './LayerConfig.tsx';
import { useAuth } from '../../features/Login/AuthContext.tsx';
import { configData } from '../../config/config.tsx';

interface LayerParams {
  id: string;
  type: string;
  units?: number;
  activation?: string;
  inputs: string[];
}

interface ModelParams {
  layers: LayerParams[];
}

export const ModelConfig: React.FC = () => {
  const { user } = useAuth();

  const [modelParams, setModelParams] = useState<ModelParams>({ layers: [] });

  const addLayer = () => {
    const newLayer: LayerParams = { id: Date.now().toString(), type: 'Dense', units: 32, activation: 'relu', inputs: [] };
    setModelParams({ ...modelParams, layers: [...modelParams.layers, newLayer] });
  };

  const updateLayer = (index: number, updatedLayer: LayerParams) => {
    const newLayers = [...modelParams.layers];
    newLayers[index] = updatedLayer;
    setModelParams({ ...modelParams, layers: newLayers });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${configData.API_URL}/api/save-model`, {
        method: 'POST', // Nebo PUT, pokud aktualizuješ existující záznam
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...modelParams, user }),
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
    <div>
      <h2>Model Configuration</h2>
      {modelParams.layers.map((layer, index) => (
        <LayerConfig 
          key={layer.id} 
          layer={layer} 
          updateLayer={(updatedLayer) => updateLayer(index, updatedLayer)}
          allLayers={modelParams.layers}
        />
      ))}
      <button onClick={addLayer}>Add Layer</button>
      <button onClick={handleSubmit}>Submit Model</button>

      <h3>Model Visualizer</h3>
      <ModelVisualizer layers={modelParams.layers} />
    </div>
  );
};

