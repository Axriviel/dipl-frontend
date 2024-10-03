import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { configData } from '../../config/config.tsx';
import { LayerConfig } from './LayerConfig.tsx';
import { LayerParams } from './Models/LayerParams.tsx';
import ModelVisualizer from './ModelVisualiser.tsx';

interface ModelParams {
  layers: LayerParams[];
}

export const ModelConfig: React.FC = () => {
  const [modelParams, setModelParams] = useState<ModelParams>({ layers: [] });
  const [newLayerType, setNewLayerType] = useState<string>('Dense');
  const [selectedLayer, setSelectedLayer] = useState<LayerParams | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);  // Přidáno pro nahrání souboru

  const addLayer = () => {
    let newLayer: LayerParams;

    switch (newLayerType) {
      case 'Dense':
        newLayer = {
          id: Date.now().toString(),
          name: "dense",
          type: 'Dense',
          units: 32,
          unitsRandom: {
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
          unitsRandom: {
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

  // Přidání handleru pro výběr souboru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!file) {
        console.error("No dataset file selected");
        return;
      }
      const formData = new FormData();
      formData.append('datasetFile', file);  // Přidání souboru do FormData
      formData.append('layers', JSON.stringify(modelParams.layers));  // Přidání vrstev do FormData

      const response = await fetch(`${configData.API_URL}/api/save-model`, {
        method: 'POST',
        credentials: 'include',
        body: formData,  // Odeslání FormData
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
        {/* Přidání nahrání datasetu */}
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <h2>Model Configuration</h2>


        <select value={newLayerType} onChange={(e) => setNewLayerType(e.target.value)}>
          <option value="Dense">Dense</option>
          <option value="Conv2D">Conv2D</option>
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
