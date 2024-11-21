import React from 'react';
import { Form } from 'react-bootstrap';
import { NumericRandomizers, RandomConfig } from '../../LayerConfig';
import { IConv2DLayer } from '../../Models/Conv2DLayer';

interface Conv2DLayerFormProps {
    currentLayer: IConv2DLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
    InputsConst: JSX.Element;
}

export const Conv2DLayerForm: React.FC<Conv2DLayerFormProps> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    renderRandomConfig,
    InputsConst,
}) => {
    return (
        <>
            <Form.Group controlId={`filters-${currentLayer.id}`}>
                <Form.Label>Filters:</Form.Label>
                {/* <Form.Check
                    type="checkbox"
                    label="Randomize Filters"
                    checked={!!currentLayer.filtersRandom}
                    onChange={() => handleRandomToggle('filters', "numeric")}
                /> */}

                <Form.Control
                    as="select"
                    value={currentLayer.unitsRandom ? currentLayer.unitsRandom.type : 'value'}
                    onChange={(e: any) => {
                        const selectedType = e.target.value;

                        handleRandomToggle('filters', selectedType as string);

                    }}
                >
                    {NumericRandomizers.map((option) => (
                        <option key={option} value={option}>
                            {option === 'value' ? 'Value' : option}
                        </option>
                    ))}
                </Form.Control>

                {renderRandomConfig('filters', currentLayer.filtersRandom)}
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
        </>
    );
};
