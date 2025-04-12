import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAlert } from '../../components/Alerts/AlertContext.tsx';
import { TaskInfoOverlay } from '../../components/TaskInfoOverlay/TaskInfoOverlay.tsx';
import { configData } from '../../config/config.tsx';
import { DownloadJSON } from '../../features/Models/DownloadJSON.tsx';
import { GetUserDatasets } from '../../features/UserDatasets/GetDatasets.tsx';
import { LayerTable } from './Features/Components/LayerTable.tsx';
import { DatasetConfigModal } from './Features/Dataset/DatasetConfigModal.tsx';
import { createBatchNormLayer } from './Features/Layers/CreateBatchNormLayer.tsx';
import { createConv2DLayer } from './Features/Layers/CreateConv2DLayer.tsx';
import { createDenseLayer } from './Features/Layers/CreateDenseLayer.tsx';
import { createDropoutLayer } from './Features/Layers/CreateDropoutLayer.tsx';
import { createFlattenLayer } from './Features/Layers/CreateFlattenLayer.tsx';
import { createGeneratorLayer } from './Features/Layers/CreateGeneratorLayer.tsx';
import { createInputLayer } from './Features/Layers/CreateInputLayer.tsx';
import { createLSTMLayer } from './Features/Layers/CreateLSTMLayer.tsx';
import { createMaxPooling2DLayer } from './Features/Layers/CreateMaxPooling2DLayer.tsx';
import { ModelConfigForm } from './Features/ModelConfigFormModal.tsx';
import { Cifar10Preset } from './Features/Presets/Cifar10Preset.tsx';
import { IndiansPreset } from './Features/Presets/IndiansPreset.tsx';
import { PresetsModal } from './Features/Presets/PresetsModal.tsx';
import { LayerConfig } from './LayerConfig.tsx';
import "./ModelConfig.css";
import { LayerParams } from './Models/LayerParams.tsx';
import { IModelParams } from './Models/ModelParams.tsx';
import { IModelSettings } from './Models/ModelSettings.tsx';
import ModelVisualizer from './ModelVisualiser.tsx';



export const ModelConfig: React.FC = () => {
  const { addAlert } = useAlert();


  // init modelParams object with one input layer and default settings
  const [modelParams, setModelParams] = useState<IModelParams>(() => ({
    layers: [createInputLayer({ id: "1732203259530" }), createDenseLayer({ id: "1732203259531", units: 1, activation: "sigmoid", inputs: ["1732203259530"] })], settings: {
      opt_algorithm: "random",
      optimizer: 'Adam',
      optimizerRandom: undefined,
      loss: 'binary_crossentropy',
      limit_growth: "none",
      model_name: "",
      k_fold: 1,
      metrics: ['accuracy'],
      monitor_metric: "accuracy",
      epochs: 10,
      epochsRandom: undefined,
      batch_size: 32,
      batch_sizeRandom: undefined,
      max_models: 10,
      use_timeout: false,
      timeout: 0,
      es_threshold: 0.4,
      NNI: {
        nni_concurrency: 1,
        nni_max_trials: 5,
        nni_tuner: "Evolution"
      },
      GA: {
        generations: 5,
        populationSize: 5,
        numParents: 2,
        mutationRate: 0.3,
        selectionMethod: "Tournament"
      }
    },
    datasetConfig: {
      x_columns: [],
      x_num: 8,
      y_columns: [],
      one_hot_x_columns: [],
      one_hot_y_columns: [],
      y_num: 9,
      test_size: 0.2,
    }
  }));

  const [newLayerType, setNewLayerType] = useState<string>('Dense');
  const [preset, setPreset] = useState<string>("Indians")
  const [selectedLayer, setSelectedLayer] = useState<LayerParams | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showDatasetSettingsModal, setShowDatasetSettingsModal] = useState<boolean>(false);
  const [showPresetsModal, setShowPresetModal] = useState<boolean>(false);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [useDefaultDataset, setUseDefaultDataset] = useState<boolean>(false)
  // const [taskActive, setTaskActive] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>([])
  const [isTaskOverlayOpen, setTaskInfoOverlay] = useState<boolean>(false);

  const selectableLayers = [
    { id: 1, name: 'Dense' },
    { id: 2, name: 'Conv2D' },
    { id: 3, name: 'Input' },
    { id: 4, name: 'Generator' },
    { id: 5, name: 'Dropout' },
    { id: 6, name: 'MaxPooling2D' },
    { id: 7, name: "Flatten" },
    { id: 8, name: "LSTM" },
    { id: 9, name: "BatchNormalization" }
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
      case 'Flatten':
        newLayer = createFlattenLayer();
        break;
      case "BatchNormalization":
        newLayer = createBatchNormLayer();
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
        optimizer: 'Adam',
        loss: 'binary_crossentropy',
        limit_growth: "none",
        model_name: "",
        k_fold: 1,
        metrics: ['accuracy'],
        monitor_metric: "val_accuracy",
        epochs: 10,
        batch_size: 32,
        max_models: 5,
        use_timeout: false,
        timeout: 0,
        es_threshold: 0.7,
        NNI: {
          nni_concurrency: 1,
          nni_max_trials: 5,
          nni_tuner: "Evolution"
        },
        GA: {
          generations: 5,
          populationSize: 5,
          numParents: 2,
          mutationRate: 0.3,
          selectionMethod: "Tournament"
        }
      },
      datasetConfig: {
        x_columns: [],          // Výchozí prázdný seznam
        x_num: 0,
        y_columns: [],
        one_hot_x_columns: [],
        one_hot_y_columns: [],
        y_num: 0,
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

  const handleOpenPresetModal = () => setShowPresetModal(true);
  const handleClosePresetModal = () => setShowPresetModal(false);

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
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFile(e.target.files[0]);
  //   }
  // };
  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataset(e.target.value);
    setUseDefaultDataset(false)
  };

  const handleDelete = (id: string) => {
    const idToDelete = id;

    // Filtruje vrstvy a odstraní aktuální vrstvu
    const updatedLayers = modelParams.layers.filter(layer => layer.id !== idToDelete);

    // remove deleted layer id from inputs of other layers
    const cleanedLayers = updatedLayers.map(layer => ({
      ...layer,
      inputs: layer.inputs.filter(inputId => inputId !== idToDelete)
    }));

    handleUpdateModelParams(cleanedLayers);
  };

  const handlePresetChange = (event: any) => {
    const selectedPreset = event.target.value;
    console.log("Selected preset:", selectedPreset);
    setPreset(selectedPreset); //set preset
    switch (selectedPreset) {
      case "Indians":
        IndiansPreset(setModelParams, setSelectedDataset);
        setUseDefaultDataset(true);
        break;

      case "Cifar10":
        Cifar10Preset(setModelParams, setSelectedDataset);
        setUseDefaultDataset(true);
        break;

      default:
        console.error("Unknown preset:", selectedPreset);
    }
  };

  // set default dataset
  useEffect(() => {
    // setUseDefaultDataset(true)
    // setSelectedDataset("pima-indians-diabetes.csv")
    // if (file === null) {
    //   fetch('/pima-indians-diabetes.csv')
    //     .then(response => response.blob())
    //     .then(blob => {
    //       const defaultFile = new File([blob], "pima-indians-diabetes.csv", { type: blob.type });
    //       setFile(defaultFile);
    //     })
    //     .catch(error => console.error("Chyba při načítání souboru:", error));
    // }
  }, []);

  // Load datasets
  useEffect(() => {
    GetUserDatasets()
      .then((data) => setDatasets(data.datasets))
      .catch((error) => console.error("Error fetching datasets:", error));
  }, []);

  const isInputCorrect = () => {
    if (!selectedDataset && !useDefaultDataset) {
      addAlert("Please select a dataset before submitting", "warning");
      return false;
    }
    if (modelParams.datasetConfig.x_columns.length === 0 || modelParams.datasetConfig.y_columns.length === 0) {
      addAlert("You need to specify data in dataset config", "warning")
      return false;
    }
    return true
  }

  const handleSubmit = () => {
    console.log(JSON.stringify(modelParams.layers));
    console.log(JSON.stringify(modelParams.settings));
    console.log(JSON.stringify(modelParams.datasetConfig));
    console.log(JSON.stringify(selectedDataset));
    const updatedTags = {
      "task": "undefined",
      "dataset": selectedDataset,
      "metric": modelParams.settings.monitor_metric,
      "userTags": tags,
    };
    console.log(JSON.stringify(updatedTags));

    if (!isInputCorrect()) {
      return
    }

    // Vytvoření FormData
    const formData = new FormData();
    formData.append("datasetFile", selectedDataset);
    formData.append("useDefaultDataset", useDefaultDataset ? "true" : "false");
    formData.append("layers", JSON.stringify(modelParams.layers));
    formData.append("settings", JSON.stringify(modelParams.settings));
    formData.append("datasetConfig", JSON.stringify(modelParams.datasetConfig));
    formData.append("tags", JSON.stringify(updatedTags));

    addAlert("Task sent to server", "info");
    // setTaskActive(true)
    // Odeslání požadavku
    fetch(`${configData.API_URL}/api/save-model`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // Zpracování chyby odpovědi
          return response.json().then((errorData) => {
            throw new Error(`Error ${response.status}: ${errorData.error}`);
          });
        }
        return response.json(); // Vrácení dat z odpovědi
      })
      .then((result) => {
        // Zpracování úspěšné odpovědi
        addAlert(result.message, "success");
        console.log("Model successfully sent to backend:", result);
      })
      .catch((error) => {
        // Zpracování chyby
        if (error instanceof Error) {
          addAlert(error.message, "error");
          console.error("Error sending model to backend:", error.message);
        } else {
          addAlert("Unknown error occurred", "error");
          console.error("Unknown error", error);
        }
      });

  };


  return (
    <div className='m-2 d-flex flex-row flex-wrap justify-content-center align-items-center'>
      <div className='model-visualizer'>
        {/* <h3>Model Visualizer</h3> */}

        <ModelVisualizer layers={modelParams.layers} onNodeClick={handleNodeClick} onLayersChange={handleLayersChange} />
      </div>

      {/* right pannel for layer selection etc. */}
      <div className='d-flex flex-column align-items-center flex-fill layer-list'>
        <h2>Model Configuration</h2>
        {/* <div className='reset-button d-flex flex-row'>
          <PresetSelector preset={preset} handlePresetChange={handlePresetChange} />
          <Button onClick={handleResetAll} className='mx-2'>Reset</Button>
        </div> */}

        <div className='model-menu-container mb-1'>
          <div className='d-flex flex-column justify-content-center align-items-center'>
            {/* <Form.Label>Select Dataset:</Form.Label> */}
            <div className='w-75 mb-2' >
              <Tippy content="Dataset used to train model">
                <Form.Select
                  className="cursor-pointer"
                  value={selectedDataset}
                  onChange={handleDatasetChange}
                >
                  <option value="">-- Select a dataset --</option>
                  {datasets.map((dataset, index) => (
                    <option key={index} value={dataset}>
                      {dataset}
                    </option>
                  ))}
                </Form.Select>
              </Tippy>
              {useDefaultDataset ? (
                <p className='mb-0 px-1 text-center'><i>Default file: {selectedDataset}</i></p>
              ) : (
                <></>
              )}
            </div>


            <div className='w-100 d-flex flex-row flex-wrap justify-content-center'>

              <div className=' d-flex flex-column justify-content-center align-items-center flex-grow-1'>
                <Tippy content='Select a layer to be added into model'>
                  <Form.Select
                    className="m-1 cursor-pointer layer-select-dropdown"
                    value={newLayerType}
                    onChange={(e) => setNewLayerType(e.target.value)}
                  >
                    <option value="">-- Select a layer --</option>
                    {selectableLayers.map((layer) => (
                      <option key={layer.id} value={layer.name}>
                        {layer.name}
                      </option>
                    ))}
                  </Form.Select>
                </Tippy>

                <Button className='m-1' onClick={addLayer}>Add Layer</Button>
              </div>

              <div className=' d-flex flex-column justify-content-center align-items-center flex-grow-1'>
                <Tippy content="Dataset specific settings">
                  <Button className='m-1' onClick={handleOpenDatasetSettingsModal}> Dataset Config</Button>
                </Tippy>

                <Tippy content="Model specific settings">
                  <Button className='m-1' onClick={handleOpenSettingsModal}> Model Settings</Button>
                </Tippy>

                <Tippy content="Presets and saved model uploading logic">
                  <Button className='m-1' onClick={handleOpenPresetModal}> Utility Settings</Button>
                </Tippy>
              </div>
            </div>
          </div>
        </div>



        <Tippy content="Download currently defined model as JSON">
          <Button className="m-1 download-json-button" onClick={DownloadJSON({
            creation_config: [
              modelParams.layers,      // Vrstva modelu
              modelParams.settings,    // Nastavení modelu
              modelParams.datasetConfig // Konfigurace datasetu
            ]
          })}>
            Download JSON
          </Button>
        </Tippy>

        <DatasetConfigModal
          datasetName={selectedDataset}
          isDefaultDataset={useDefaultDataset}
          datasetParams={modelParams.datasetConfig}
          setDatasetConfig={(value) => setModelParams(value as IModelParams)}
          show={showDatasetSettingsModal}
          handleClose={handleCloseDatasetModal} />

        {/* Modální okno pro úpravu nastavení modelu */}
        <ModelConfigForm
          modelParams={modelParams}
          setModelParams={setModelParams}
          show={showSettingsModal}
          handleClose={handleCloseSettingsModal}
          tags={tags}
          setTags={setTags}
        />

        <PresetsModal
          show={showPresetsModal}
          handleClose={handleClosePresetModal}
          preset={preset}
          handlePresetChange={handlePresetChange}
          setModelParams={setModelParams}
          handleResetAll={() => {
            handleResetAll();
            handleClosePresetModal();
          }}
        />


        {/* <select className='p-1 m-1' value={newLayerType} onChange={(e) => setNewLayerType(e.target.value)}>
            {selectableLayers.map((layer) => (
              <option key={layer.id} value={layer.name}>
                {layer.name}
              </option>
            ))}
          </select> */}

        <LayerTable
          layers={modelParams.layers}
          handleLayerClick={handleLayerClick}
          handleDelete={handleDelete}
        />
        {/* {modelParams.layers.map((layer) => (
          <Button
            key={layer.id}
            onClick={() => handleLayerClick(layer)}
            className="m-2"
            variant="primary"
          >
            {layer.type} Layer (ID: {layer.id})
          </Button>
        ))} */}
        <Tippy placement='bottom' content="Sends the task to backend. You will be notified about the result when finished">
          <Button onClick={handleSubmit}>Submit Model</Button>
        </Tippy>
        <Button variant="secondary" className="m-2" onClick={() => setTaskInfoOverlay(!isTaskOverlayOpen)}>Status</Button>
      </div>
      {/* <div className='model-config-progress-bar'>
        <TaskProgressBar isActive={taskActive}
          setIsActive={setTaskActive} />
      </div> */}
      {isTaskOverlayOpen && <TaskInfoOverlay />}
      {
        selectedLayer && (
          <LayerConfig
            layer={selectedLayer}
            isGenerator={false}
            updateLayer={(updatedLayer) => updateLayer(modelParams.layers.findIndex(l => l.id === updatedLayer.id), updatedLayer)}
            handleDelete={handleDelete}
            allLayers={modelParams.layers}
            show={showModal}
            updateModelParams={handleUpdateModelParams}
            handleClose={handleCloseModal}
          />
        )
      }
    </div >
  );
};
