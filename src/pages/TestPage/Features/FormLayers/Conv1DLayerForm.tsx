import React from 'react';
import { Form } from 'react-bootstrap';
import { activationFunctions } from '../../../../features/ModelLayers/Activations';
import { IConv1DLayer } from '../../Models/Conv1DLayer';
import { RandomizerSelect } from '../RandomizerSelect';
import { renderRandomConfig } from '../Randomness/RenderRandomConfig';
import { NumericRandomizers, TextRandomizers } from '../../Models/RandomConfigModels';

interface Props {
    currentLayer: IConv1DLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    InputsConst: JSX.Element;
    handleActivationChange: (e: any) => void;
}

export const Conv1DLayerForm: React.FC<Props> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    InputsConst,
    handleActivationChange,
}) => {
    return (
        <div className='custom-form'>
            <Form.Group>
                <Form.Label>Filters:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.filtersRandom?.type || 'value'}
                    onChange={(type: any) => handleRandomToggle('filters', type)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig('filters', currentLayer.filtersRandom, handleChange)}
                {!currentLayer.filtersRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.filters || 32}
                        onChange={(e) => handleChange('filters', parseInt(e.target.value))}
                    />
                )}
            </Form.Group>

            <Form.Group>
                <Form.Label>Kernel Size:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.kernel_sizeRandom?.type || 'value'}
                    onChange={(type: any) => handleRandomToggle('kernel_size', type)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig('kernel_size', currentLayer.kernel_sizeRandom, handleChange)}
                {!currentLayer.kernel_sizeRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.kernel_size || 3}
                        onChange={(e) => handleChange('kernel_size', parseInt(e.target.value))}
                    />
                )}
            </Form.Group>

            <Form.Group>
                <Form.Label>Strides:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.stridesRandom?.type || 'value'}
                    onChange={(type: any) => handleRandomToggle('strides', type)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig('strides', currentLayer.stridesRandom, handleChange)}
                {!currentLayer.stridesRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.strides || 1}
                        onChange={(e) => handleChange('strides', parseInt(e.target.value))}
                    />
                )}
            </Form.Group>

            <Form.Group>
                <Form.Label>Padding:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.paddingRandom?.type || 'value'}
                    onChange={(type: any) => handleRandomToggle('padding', type)}
                    options={TextRandomizers}
                />
                {renderRandomConfig('padding', currentLayer.paddingRandom, handleChange)}
                {!currentLayer.paddingRandom && (
                    <Form.Select
                        value={currentLayer.padding || 'valid'}
                        onChange={(e) => handleChange('padding', e.target.value)}
                    >
                        <option value="valid">valid</option>
                        <option value="same">same</option>
                    </Form.Select>
                )}
            </Form.Group>

            <Form.Group>
                <Form.Label>Activation:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.activationRandom?.type || 'value'}
                    onChange={(type: any) => handleRandomToggle('activation', type)}
                    options={TextRandomizers}
                />
                {renderRandomConfig('activation', currentLayer.activationRandom, handleChange)}
                {!currentLayer.activationRandom && (
                    <Form.Select
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
