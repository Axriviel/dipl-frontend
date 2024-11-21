import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAlert } from '../../components/Alerts/AlertContext.tsx';
import { configData } from '../../config/config.tsx';
import { DatasetConfigModal } from './Features/Dataset/DatasetConfigModal.tsx';
import { createConv2DLayer } from './Features/Layers/CreateConv2DLayer.tsx';
import { createDenseLayer } from './Features/Layers/CreateDenseLayer.tsx';
import { createGeneratorLayer } from './Features/Layers/CreateGeneratorLayer.tsx';
import { createInputLayer } from './Features/Layers/CreateInputLayer.tsx';
import { ModelConfigForm } from './Features/ModelConfigFormModal.tsx';
import { LayerConfig } from './LayerConfig.tsx';
import "./ModelConfig.css";
import { IDatasetConfig } from './Models/DatasetConfig.tsx';
import { LayerParams } from './Models/LayerParams.tsx';
import { IModelSettings } from './Models/ModelSettings.tsx';
import ModelVisualizer from './ModelVisualiser.tsx';
import { createDropoutLayer } from './Features/Layers/CreateDropoutLayer.tsx';
import { createMaxPooling2DLayer } from './Features/Layers/CreateMaxPooling2DLayer.tsx';
import { createLSTMLayer } from './Features/Layers/CreateLSTMLayer.tsx';

export interface ModelParams {
  layers: LayerParams[];
  settings: IModelSettings;
  datasetConfig: IDatasetConfig;
}

export const ModelConfig: React.FC = () => {
  const { addAlert } = useAlert();


  // init modelParams object with one input layer and default settings
  const [modelParams, setModelParams] = useState<ModelParams>(() => ({
    layers: [createInputLayer({ id: "1732203259530" }), createDenseLayer({ id: "1732203259531", units: 1, activation: "sigmoid", inputs: ["1732203259530"] })], settings: {
      opt_algorithm: "random",
      optimizer: 'adam',
      loss: 'binary_crossentropy',
      metrics: ['accuracy'],
      monitor_metric: "val_accuracy",
      epochs: 10,
      batch_size: 32,
      NNI: {
        nni_concurrency: 1,
        nni_max_trials: 5,
        nni_tuner: "Evolution"
      }
    },
    datasetConfig: {
      x_columns: [],          // Výchozí prázdný seznam
      x_num: 8,
      y_column: "",
      y_num: 9,
      test_size: 0.2,         // Výchozí hodnota pro testovací sadu
      // file: null,             // Výchozí hodnota pro soubor
    }
  }));

  const [newLayerType, setNewLayerType] = useState<string>('Dense');
  const [selectedLayer, setSelectedLayer] = useState<LayerParams | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showDatasetSettingsModal, setShowDatasetSettingsModal] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);  // dataset upload
  const selectableLayers = [
    { id: 1, name: 'Dense' },
    { id: 2, name: 'Conv2D' },
    { id: 3, name: 'Input' },
    { id: 4, name: 'Generator' },
    { id: 5, name: 'Dropout' },
    { id: 6, name: 'MaxPooling2D' },
    { id: 7, name: "LSTM" }
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
      case 'Dropout':
        newLayer = createDropoutLayer();
        break;
      case 'MaxPooling2D':
        newLayer = createMaxPooling2DLayer();
        break;
      case 'LSTM':
        newLayer = createLSTMLayer();
        break;
      default:
        return;
    }

    setModelParams({ ...modelParams, layers: [...modelParams.layers, newLayer] });
  };

  const handleResetAll = () => {
    setModelParams({
      layers: [createInputLayer()], settings: {
        opt_algorithm: "random",
        optimizer: 'adam',
        loss: 'binary_crossentropy',
        metrics: ['accuracy'],
        monitor_metric: "val_accuracy",
        epochs: 10,
        batch_size: 32,
        NNI: {
          nni_concurrency: 1,
          nni_max_trials: 5,
          nni_tuner: "Evolution"
        }
      },
      datasetConfig: {
        x_columns: [],          // Výchozí prázdný seznam
        x_num: 8,
        y_column: "",
        y_num: 9,
        test_size: 0.2,         // Výchozí hodnota pro testovací sadu
        // file: null,             // Výchozí hodnota pro soubor
      }
    })
  }

  const updateLayer = (index: number, updatedLayer: LayerParams) => {
    const newLayers = [...modelParams.layers];
    newLayers[index] = updatedLayer;
    setModelParams({ ...modelParams, layers: newLayers });
  };

  // set model params - layers or settings if provided 
  // created mainly to allow safely deleting from the LayerConfig component
  const handleUpdateModelParams = (updatedLayers?: LayerParams[], updatedSettings?: IModelSettings) => {
    setModelParams(prevParams => ({
      ...prevParams,
      layers: updatedLayers ?? prevParams.layers,
      settings: updatedSettings ?? prevParams.settings
    }));
  };

  const handleLayerClick = (layer: LayerParams) => {
    setSelectedLayer(layer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLayer(null);
  };

  const handleOpenSettingsModal = () => setShowSettingsModal(true);
  const handleCloseSettingsModal = () => setShowSettingsModal(false);


  const handleOpenDatasetSettingsModal = () => setShowDatasetSettingsModal(true);
  const handleCloseDatasetModal = () => setShowDatasetSettingsModal(false);  // Zavření modálního okna datasetu


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

  // set default dataset
  // useEffect(() => {
  //   fetch('/pima-indians-diabetes.csv')
  //     .then(response => response.blob())
  //     .then(blob => {
  //       const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
  //       setFile(defaultFile);
  //     })
  //     .catch(error => console.error("Chyba při načítání souboru:", error));
  // }, []);

  const handleSubmit = async () => {
    console.log(JSON.stringify(modelParams.layers))
    console.log(JSON.stringify(modelParams.settings))
    console.log(JSON.stringify(modelParams.datasetConfig))

    try {
      if (!file) {
        console.error("No dataset file selected");
        return;
      }
      const formData = new FormData();
      formData.append('datasetFile', file);  // Přidání souboru do FormData
      formData.append('layers', JSON.stringify(modelParams.layers));  // Přidání vrstev do FormData
      formData.append("settings", JSON.stringify(modelParams.settings)) //add settings to form
      formData.append("datasetConfig", JSON.stringify(modelParams.datasetConfig))

      const response = await fetch(`${configData.API_URL}/api/save-model`, {
        method: 'POST',
        credentials: 'include',
        body: formData,  // Odeslání FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }

      const result = await response.json();
      addAlert(result.message, "success")
      console.log('Model successfully sent to backend:', result);
    } catch (error) {
      if (error instanceof Error) {
        addAlert(error.message, "error");
        console.error('Error sending model to backend:', error.message);
      } else {
        addAlert("" + error, "error");
        console.error('Unknown error', error);
      }
    }
  };

  return (
    <div className='m-2 d-flex flex-row flex-wrap'>
      <div className='model-visualizer'>
        {/* <h3>Model Visualizer</h3> */}

        <ModelVisualizer layers={modelParams.layers} onNodeClick={handleNodeClick} onLayersChange={handleLayersChange} />
      </div>

      {/* right pannel for layer selection etc. */}
      <div className='d-flex flex-column align-items-center flex-fill layer-list'>
        <h2>Model Configuration</h2>
        <Button onClick={handleResetAll} className='reset-button'>Reset</Button>

        {/* Přidání nahrání datasetu */}
        <input type="file" accept=".csv,.tsv,.npy,.npz,.h5" onChange={handleFileChange} />
        {file ? (
          <p>Výchozí soubor: {file.name}</p>
        ) : (
          <p>Žádný soubor nebyl vybrán</p>
        )}


        <div className='d-flex flex-row flex-wrap'>
          <Button className='m-1' onClick={handleOpenDatasetSettingsModal}> Dataset Config</Button>
          <Button className='m-1' onClick={handleOpenSettingsModal}> Model Settings</Button>
        </div>

        <DatasetConfigModal
          modelParams={modelParams}
          setModelParams={setModelParams}
          show={showDatasetSettingsModal}
          handleClose={handleCloseDatasetModal} />

        {/* Modální okno pro úpravu nastavení modelu */}
        <ModelConfigForm
          modelParams={modelParams}
          setModelParams={setModelParams}
          show={showSettingsModal}
          handleClose={handleCloseSettingsModal}
        />

        <select className='p-1 m-1' value={newLayerType} onChange={(e) => setNewLayerType(e.target.value)}>
          {selectableLayers.map((layer) => (
            <option key={layer.id} value={layer.name}>
              {layer.name}
            </option>
          ))}
        </select>

        <Button onClick={addLayer}>Add Layer</Button>

        {modelParams.layers.map((layer) => (
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
          updateModelParams={handleUpdateModelParams}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};
