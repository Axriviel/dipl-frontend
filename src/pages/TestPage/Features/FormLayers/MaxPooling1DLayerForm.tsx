import React from 'react';
import { Form } from 'react-bootstrap';
import { RandomizerSelect } from '../RandomizerSelect';
import { renderRandomConfig } from '../Randomness/RenderRandomConfig';
import { NumericRandomizers, TextRandomizers } from '../../Models/RandomConfigModels';
import { IMaxPooling1DLayer } from '../../Models/MaxPooling1D';

interface Props {
    currentLayer: IMaxPooling1DLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    InputsConst: JSX.Element;
}

export const MaxPooling1DLayerForm: React.FC<Props> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    InputsConst
}) => {
    return (
        <div className='custom-form'>
            <Form.Group>
                <Form.Label>Pool Size:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.pool_sizeRandom?.type || 'value'}
                    onChange={(type: any) => handleRandomToggle('pool_size', type)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig('pool_size', currentLayer.pool_sizeRandom, handleChange)}
                {!currentLayer.pool_sizeRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.pool_size || 2}
                        onChange={(e) => handleChange('pool_size', parseInt(e.target.value))}
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
                        value={currentLayer.strides || 2}
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

            {InputsConst}
        </div>
    );
};
