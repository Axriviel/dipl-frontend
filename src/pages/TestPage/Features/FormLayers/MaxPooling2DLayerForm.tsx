import React from "react";
import { Form } from "react-bootstrap";
import { IMaxPooling2D } from "../../Models/MaxPooling2D";
import { DebouncedTextInput } from "../../../../components/FormElements/DebouncedTextInput";

interface Props {
    currentLayer: IMaxPooling2D;
    handleChange: (key: string, value: any) => void;
    InputsConst: JSX.Element;
}

export const MaxPooling2DLayerForm: React.FC<Props> = ({ currentLayer, handleChange, InputsConst }) => (
    <>
    <Form.Group controlId={`poolSize-${currentLayer.id}`}>
        <Form.Label>Pool Size:</Form.Label>
        <DebouncedTextInput
            value={currentLayer.poolSize?.join(',') || '2,2'}
            timeout={700}
            onChange={(value) => {
                const parsedValue = value.split(',').map(Number);
                handleChange('poolSize', parsedValue); // Odeslání změny přes handleChange
            }}
        />
    </Form.Group>
    {InputsConst}
    </>
);
