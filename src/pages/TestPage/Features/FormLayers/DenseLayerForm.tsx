import React from 'react';
import { Form } from 'react-bootstrap';
import { activationFunctions } from '../../../../features/ModelLayers/Activations';
import { IDenseLayer } from '../../Models/DenseLayer';
import { RandomizerSelect } from '../RandomizerSelect';
import { renderRandomConfig } from '../Randomness/RenderRandomConfig';
import { NumericRandomizers, TextRandomizers } from '../../Models/RandomConfigModels';

interface Props {
    currentLayer: IDenseLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    // renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
    InputsConst: JSX.Element;
    handleActivationChange: (e: any) => void;
}

export const DenseLayerForm: React.FC<Props> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    // renderRandomConfig,
    InputsConst,
    handleActivationChange,
}) => {
    return (
        <div className='custom-form'>
            <Form.Group controlId={`units-${currentLayer.id}`}>
                <Form.Label>Units:</Form.Label>


                {/* <Form.Check
                    type="checkbox"
                    label="Randomize Units"
                    checked={!!currentLayer.unitsRandom}
                    onChange={() => handleRandomToggle('units', "numeric-test")}
                /> */}
                {/* <Form.Control
                    as="select"
                    value={currentLayer.unitsRandom ? currentLayer.unitsRandom.type : 'value'}
                    onChange={(e: any) => {
                        const selectedType = e.target.value;

                        handleRandomToggle('units', selectedType as string);

                    }}
                >
                    {NumericRandomizers.map((option) => (
                        <option key={option} value={option}>
                            {option === 'value' ? 'Value' : option}
                        </option>
                    ))}
                </Form.Control> */}

                <RandomizerSelect
                    value={currentLayer.unitsRandom ? currentLayer.unitsRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('units', selectedType)}
                    options={NumericRandomizers} // Můžeš předat jakýkoliv seznam možností
                />


                {renderRandomConfig('units', currentLayer.unitsRandom, handleChange)}
                {!currentLayer.unitsRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.units || 32}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('units', parseInt(e.target.value))}
                    />
                )}
            </Form.Group>
            <>
                {console.log(currentLayer.activationRandom)}
            </>
            <Form.Group controlId={`activation-${currentLayer.id}`}>
                <Form.Label>Activation:</Form.Label>
                {/* <Form.Check
                    type="checkbox"
                    label="Randomize Activation"
                    checked={!!currentLayer.activationRandom}
                    onChange={() => handleRandomToggle('activation', "text")}
                /> */}



                {/* vytvoření selektoru -> options jsou zde randomizační možnosti a podle toho se následně dotváří celá část formuláře*/}
                <RandomizerSelect
                    value={currentLayer.activationRandom ? currentLayer.activationRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('activation', selectedType)}
                    options={TextRandomizers}
                />
                {/* {renderRandomConfig('activation', { type: "text", options: currentLayer.activationRandom.options })} */}

                {/* prvním parametrem je prvek, který bude randomizován a druhým je proměnná v currentLayer, do které se to ukládá */}
                {renderRandomConfig('activation', currentLayer.activationRandom, handleChange)}
                {!currentLayer.activationRandom && (
                    <Form.Select
                        as="select"
                        value={currentLayer.activation || ''}
                        onChange={handleActivationChange}
                    >
                        {activationFunctions.map((fn) => (
                            <option key={fn} value={fn}>
                                {fn}
                            </option>
                        ))}
                    </Form.Select>
                )}
            </Form.Group>
            {InputsConst}
        </div>
    );
};
