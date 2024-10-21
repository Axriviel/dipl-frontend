import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { configData } from '../../config/config.tsx';
import { createConv2DLayer } from './Features/Layers/CreateConv2DLayer.tsx';
import { createDenseLayer } from './Features/Layers/CreateDenseLayer.tsx';
import { createInputLayer } from './Features/Layers/CreateInputLayer.tsx';
import { LayerConfig } from './LayerConfig.tsx';
import { LayerParams } from './Models/LayerParams.tsx';
import ModelVisualizer from './ModelVisualiser.tsx';
import { createGeneratorLayer } from './Features/Layers/CreateGeneratorLayer.tsx';
import "./ModelConfig.css"

interface ModelParams {
  layers: LayerParams[];
}

export const ModelConfig: React.FC = () => {
  const [modelParams, setModelParams] = useState<ModelParams>({ layers: [createInputLayer()] });
  const [newLayerType, setNewLayerType] = useState<string>('Dense');
  const [selectedLayer, setSelectedLayer] = useState<LayerParams | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);  // Přidáno pro nahrání souboru
  const selectableLayers = [
    { id: 1, name: 'Dense' },
    { id: 2, name: 'Conv2D' },
    { id: 3, name: 'Input' },
    { id: 4, name: 'Generator' }
  ];
  const addLayer = () => {
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

  // Handler pro kliknutí na uzel v ModelVisualizer
  const handleNodeClick = (node: any) => {
    const layer = modelParams.layers.find(l => l.id === node.id);
    if (layer) {
      setSelectedLayer(layer);
      setShowModal(true);
    }
  };

    // Funkce pro aktualizaci vrstev z ModelVisualizer - přidání propojení mezi vrstvami
    const handleLayersChange = (updatedLayers: LayerParams[]) => {
      setModelParams((prev) => ({ ...prev, layers: updatedLayers }));
    };

  // Přidání handleru pro výběr souboru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log(JSON.stringify(modelParams.layers))

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
    <div className='m-2 d-flex flex-row flex-wrap'>
      <div className='model-visualizer'>
      {/* <h3>Model Visualizer</h3> */}

        <ModelVisualizer layers={modelParams.layers} onNodeClick={handleNodeClick} onLayersChange={handleLayersChange} />
      </div>

      <div className='d-flex flex-column align-items-center flex-fill layer-list'>
        {/* Přidání nahrání datasetu */}
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <h2>Model Configuration</h2>


        <select value={newLayerType} onChange={(e) => setNewLayerType(e.target.value)}>
          {selectableLayers.map((layer) => (
            <option key={layer.id} value={layer.name}>
              {layer.name}
            </option>
          ))}
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
      </div>


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
