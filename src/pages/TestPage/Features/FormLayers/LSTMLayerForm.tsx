import React from 'react';
import { Form } from 'react-bootstrap';
import { activationFunctions } from '../../../../features/ModelLayers/Activations';
import { NumericRandomizers, RandomConfig, TextRandomizers } from '../../LayerConfig';
import { RandomizerSelect } from '../RandomizerSelect';

interface Props {
    currentLayer: any; // Můžeš použít přesný typ, pokud máš interface pro LSTM vrstvu
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
    InputsConst: JSX.Element;

}

export const LSTMLayerForm: React.FC<Props> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    renderRandomConfig,
    InputsConst,
}) => {
    return (
        <>
            {/* Randomizace pro units */}
            <Form.Group controlId={`units-${currentLayer.id}`}>
                <Form.Label>Units:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.unitsRandom ? currentLayer.unitsRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('units', selectedType)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig('units', currentLayer.unitsRandom)}
                {!currentLayer.unitsRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.units || 64}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange('units', parseInt(e.target.value))
                        }
                    />
                )}
            </Form.Group>

            {/* Randomizace pro activation */}
            <Form.Group controlId={`activation-${currentLayer.id}`}>
                <Form.Label>Activation:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.activationRandom ? currentLayer.activationRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('activation', selectedType)}
                    options={TextRandomizers}
                />
                {renderRandomConfig('activation', currentLayer.activationRandom)}
                {!currentLayer.activationRandom && (
                    <Form.Control
                        as="select"
                        value={currentLayer.activation || 'tanh'}
                        onChange={(e: any) =>
                            handleChange('activation', e.target.value)
                        }
                    >
                        {activationFunctions.map((func) => (
                            <option key={func} value={func}>
                                {func}
                            </option>
                        ))}
                    </Form.Control>
                )}
            </Form.Group>

            {/* Recurrent Activation */}
            <Form.Group controlId={`recurrentActivation-${currentLayer.id}`}>
                <Form.Label>Recurrent Activation:</Form.Label>
                <Form.Control
                    as="select"
                    value={currentLayer.recurrentActivation || 'sigmoid'}
                    onChange={(e: any) =>
                        handleChange('recurrentActivation', e.target.value)
                    }
                >
                    {activationFunctions.map((func) => (
                        <option key={func} value={func}>
                            {func}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            {/* Return Sequences */}
            <Form.Group controlId={`returnSequences-${currentLayer.id}`}>
                <Form.Check
                    type="checkbox"
                    label="Return Sequences"
                    checked={!!currentLayer.returnSequences}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('returnSequences', e.target.checked)
                    }
                />
            </Form.Group>
            {InputsConst}
        </>
    );
};
