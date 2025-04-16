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

                <RandomizerSelect
                    value={currentLayer.unitsRandom ? currentLayer.unitsRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('units', selectedType)}
                    options={NumericRandomizers}
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
                <RandomizerSelect
                    value={currentLayer.activationRandom ? currentLayer.activationRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('activation', selectedType)}
                    options={TextRandomizers}
                />
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
