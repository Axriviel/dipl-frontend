import React from 'react';
import { Form } from 'react-bootstrap';
import { IConv2DLayer } from '../../Models/Conv2DLayer';
import { RandomizerSelect } from '../RandomizerSelect';
import { renderRandomConfig } from '../Randomness/RenderRandomConfig';
import { NumericRandomizers } from '../../Models/RandomConfigModels';

interface Conv2DLayerFormProps {
    currentLayer: IConv2DLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    // renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
    InputsConst: JSX.Element;
}

export const Conv2DLayerForm: React.FC<Conv2DLayerFormProps> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    // renderRandomConfig,
    InputsConst,
}) => {
    return (
        <div className="custom-form">
            <Form.Group controlId={`filters-${currentLayer.id}`}>
                <Form.Label>Filters:</Form.Label>

                <RandomizerSelect
                    value={currentLayer.filtersRandom ? currentLayer.filtersRandom.type : 'value'}
                    onChange={(selectedType: string) => handleRandomToggle('filters', selectedType)}
                    options={NumericRandomizers} 
                />

                {renderRandomConfig('filters', currentLayer.filtersRandom, handleChange)}
                {!currentLayer.filtersRandom && (
                    <Form.Control
                        type="number"
                        value={currentLayer.filters || 64}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('filters', parseInt(e.target.value))}
                    />
                )}
            </Form.Group>

            <Form.Group controlId={`kernelSize-${currentLayer.id}`}>
                <Form.Label>Kernel Size:</Form.Label>
                <Form.Control
                    type="text"
                    value={currentLayer.kernel_size ? currentLayer.kernel_size.join(',') : ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('kernel_size', e.target.value.split(',').map(Number))
                    }
                />
            </Form.Group>
            {InputsConst}
        </div>
    );
};
