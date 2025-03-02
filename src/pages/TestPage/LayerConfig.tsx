import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Modal } from 'react-bootstrap';
import { DebouncedTextInput } from '../../components/FormElements/DebouncedTextInput';
import { Conv2DLayerForm } from './Features/FormLayers/Conv2DLayerForm';
import { DenseLayerForm } from './Features/FormLayers/DenseLayerForm';
import { DropoutLayerForm } from './Features/FormLayers/DropoutLayerForm';
import { FlattenLayerForm } from './Features/FormLayers/FlattenLayerForm';
import { GeneratorLayerForm } from './Features/FormLayers/GeneratorLayerForm';
import { InputLayerForm } from './Features/FormLayers/InputLayerForm';
import { LSTMLayerForm } from './Features/FormLayers/LSTMLayerForm';
import { MaxPooling2DLayerForm } from './Features/FormLayers/MaxPooling2DLayerForm';
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


//upravit aktualizaci a použít podobný přístup - udělat více interface pro ostatní možnosti a pokusit se to přendat do modálu?
// Definice struktur pro náhodnost
interface IRandomConfigBase {
  type: 'numeric' | 'text' | "numeric-test";
}

interface INumericRandomConfig extends IRandomConfigBase {
  type: 'numeric';
  min: number;
  max: number;
  step?: number; // Volitelný parametr
}

interface ITestNumericRandomConfig extends IRandomConfigBase {
  type: "numeric-test";
  min: number;
  max: number;
}


interface ITextRandomConfig extends IRandomConfigBase {
  type: 'text';
  options: string[];
}

export type RandomConfig = INumericRandomConfig | ITextRandomConfig | ITestNumericRandomConfig;
export const NumericRandomizers = ["value", "numeric", "numeric-test"];
export const TextRandomizers = ["value", "text"];

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

    // // Filtruje vrstvy a odstraní aktuální vrstvu
    // const updatedLayers = allLayers.filter(layer => layer.id !== idToDelete);

    // // remove deleted layer id from inputs of other layers
    // const cleanedLayers = updatedLayers.map(layer => ({
    //   ...layer,
    //   inputs: layer.inputs.filter(inputId => inputId !== idToDelete)
    // }));

    // updateModelParams(cleanedLayers);
    handleClose();
  };

  const handleChange = (key: string, value: any) => {
    console.log(`Updating ${key} to`, value);

    setCurrentLayer((prevLayer) => {
      if (key.includes("Random")) {
        const [randomKey, property] = key.split('.'); // Např. 'activationRandom.options'

        const randomConfig = prevLayer[randomKey] || {}; // Inicializace randomConfig, pokud neexistuje

        // Vytvoř nový objekt randomConfig s novou hodnotou
        const updatedRandomConfig = {
          ...randomConfig,
          [property]: value, // Aktualizuj specifickou vlastnost (např. options)
        };

        const updatedLayer = {
          ...prevLayer,
          [randomKey]: updatedRandomConfig, // Aktualizuj celou část randomizeru
        };

        console.log("Updated layer:", updatedLayer); // Debugging - ukazuje nový stav layeru
        return updatedLayer; // Vracíme aktualizovaný stav
      }

      // Normální aktualizace mimo random config
      return { ...prevLayer, [key]: value };
    });
  };

  //toggle random for a parameter and creates default values based on randomization type
  const handleRandomToggle = (key: string, type: string) => {
    setCurrentLayer((prevLayer) => {
      // Ověření, zda klíč existuje v aktuální vrstvě
      const randomEnabled = prevLayer.hasOwnProperty(`${key}Random`);
      console.log("Current randomEnabled:", randomEnabled);  // Debugging

      console.log("nastavuji " + key + " na " + type)

      if (type === 'value') {
        // Vypnutí náhodnosti
        return {

          ...prevLayer,
          [`${key}Random`]: undefined,
        };
      }

      return {
        ...prevLayer,
        [`${key}Random`]: randomEnabled
          ? (() => {   // Inline funkce pro přiřazení podle typu
            switch (type) {
              case 'numeric':
                return { type: 'numeric', min: 1, max: 100, step: 1 };  // Výchozí hodnoty pro 'numeric'

              case 'numeric-test':
                return { type: 'numeric-test', min: 1, max: 100 };  // Výchozí hodnoty pro 'numeric-test'

              case 'text':
                return { type: 'text', options: ['option1', 'option2'] };  // Výchozí hodnoty pro 'text'

              default:
                throw new Error(`Unsupported type: ${type}`);  // Ošetření neznámého typu
            }
          })() //závorky způsobí vyhodnocení funkce, musí zde být
          : undefined  // Pokud se vypne náhodnost, odstraní konfiguraci
      };
    });
  };


  //returns form options for selected randomness
  const renderRandomConfig = (key: string, randomConfig: RandomConfig | undefined) => {
    if (!randomConfig) return null;  // Pokud není náhodnost aktivovaná, nic se nezobrazí
    console.log(randomConfig)

    switch (randomConfig.type) {
      case 'numeric':
        return (
          <>
            <Form.Group controlId={`${key}-min`}>
              <Form.Label>Min Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as INumericRandomConfig).min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.min`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId={`${key}-max`}>
              <Form.Label>Max Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as INumericRandomConfig).max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.max`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId={`${key}-step`}>
              <Form.Label>Step (Optional):</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as INumericRandomConfig).step || 1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.step`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
          </>
        );

      case "numeric-test":
        return (
          <>
            <Form.Group controlId={`${key}-min`}>
              <Form.Label>Min Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as ITestNumericRandomConfig).min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.min`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
            <Form.Group controlId={`${key}-max`}>
              <Form.Label>Max Value:</Form.Label>
              <Form.Control
                type="number"
                value={(randomConfig as ITestNumericRandomConfig).max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(`${key}Random.max`, parseFloat(e.target.value))
                }
              />
            </Form.Group>
          </>

        )
      case 'text':
        const handleDebouncedChange = useCallback((value: string) => {
          const newOptions = value ? value.split(',').map(option => option.trim()).filter(option => option !== '') : [];
          handleChange(`${key}Random.options`, newOptions); // Volání handleChange s novými options
        }, [key, handleChange]); // Závislosti zůstávají stejné, pokud se nemění key nebo handleChange

        return (
          <>
            <Form.Group controlId={`${key}-options`}>
              <Form.Label>Options:</Form.Label>

              <DebouncedTextInput
                onChange={handleDebouncedChange} // Použití stabilizované verze onChange
                value={(randomConfig as ITextRandomConfig).options.join(', ')} // Zobrazení pole jako čárkou oddělený řetězec
              />

            </Form.Group>

            {/* stará verze, ještě před debounced inputem */}
            {/* <Form.Group controlId={`${key}-options`}>
              <Form.Label>Options:</Form.Label>
              <Form.Control
                type="text"
                value={(randomConfig as ITextRandomConfig).options.join(', ')}  // Zobrazení pole jako čárkou oddělený řetězec
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newOptions = e.target.value ? e.target.value.split(',').map(option => option.trim()).filter(option => option !== '') : [];
                  //console.log("toto jsou nove options:", newOptions)
                  handleChange(`${key}Random.options`, newOptions);
                }}
              />

            </Form.Group> */}
          </>
        );
      default:
        return null;
    }
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

      <Form.Label> {isGenerator ? "Possible follows:" : "Inputs:"}</Form.Label>
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
            renderRandomConfig={renderRandomConfig}
            InputsConst={InputsConst}
            handleActivationChange={handleActivationChange} //tady by mohl být ten problém. Používám handleActivationChange, ale úpravu tam má jen handlechange
          />
        );
      case 'Conv2D':
        return (
          <Conv2DLayerForm
            currentLayer={currentLayer as IConv2DLayer}
            handleChange={handleChange}
            handleRandomToggle={handleRandomToggle}
            renderRandomConfig={renderRandomConfig}
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
              renderRandomConfig={renderRandomConfig}
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
            renderRandomConfig={renderRandomConfig}
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
            renderRandomConfig={renderRandomConfig}
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
        <FormGroup controlId={`id-${currentLayer.id}`}>
          <Form.Label>Name</Form.Label>
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
