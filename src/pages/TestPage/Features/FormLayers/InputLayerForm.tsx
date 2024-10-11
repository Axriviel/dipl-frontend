import React from 'react';
import { Form } from 'react-bootstrap';
import { IInputLayer } from '../../Models/InputLayer';

interface InputLayerFormProps {
    currentLayer: IInputLayer;
    handleChange: (key: string, value: any) => void;
}

export const InputLayerForm: React.FC<InputLayerFormProps> = ({ currentLayer, handleChange }) => {
    return (
        <>
            <Form.Group controlId={`shape-${currentLayer.id}`}>
                <Form.Label>Input Shape:</Form.Label>
                <Form.Control
                    type="text"
                    value={currentLayer.shape ? currentLayer.shape.join(',') : ''} // Zobrazení pole jako řetězce                    
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('shape', e.target.value.split(',').map(Number)) // Převod řetězce na pole čísel
                    } />
            </Form.Group>

            <Form.Group controlId={`batch_size-${currentLayer.id}`}>
                <Form.Label>Batch Size (Optional):</Form.Label>
                <Form.Control
                    type="number"
                    value={currentLayer.batch_size || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('batchSize', parseInt(e.target.value))}
                />
            </Form.Group>

            <Form.Group controlId={`dtype-${currentLayer.id}`}>
                <Form.Label>Data Type (dtype):</Form.Label>
                <Form.Control
                    as="select"
                    value={currentLayer.dtype || 'float32'}
                    onChange={(e: any) => handleChange('dtype', e.target.value)}
                >
                    <option value="float32">float32</option>
                    <option value="float64">float64</option>
                    <option value="int32">int32</option>
                    <option value="bool">bool</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId={`sparse-${currentLayer.id}`}>
                <Form.Check
                    type="checkbox"
                    label="Sparse Input"
                    checked={currentLayer.sparse || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('sparse', e.target.checked)}
                />
            </Form.Group>
        </>
    );
};
