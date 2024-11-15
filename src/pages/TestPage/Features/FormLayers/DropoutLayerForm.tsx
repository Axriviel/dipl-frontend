import { Form } from "react-bootstrap";
import { NumericRandomizers, RandomConfig } from "../../LayerConfig";
import { RandomizerSelect } from "../RandomizerSelect";
import { IDropoutLayer } from "../../Models/DropoutLayer";

interface Props {
    currentLayer: IDropoutLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
    InputsConst: JSX.Element;
}

export const DropoutLayerForm: React.FC<Props> = ({ currentLayer, handleChange, handleRandomToggle, renderRandomConfig, InputsConst }) => (
    <>
        <Form.Group controlId={`dropoutRate-${currentLayer.id}`}>
            <Form.Label>Dropout Rate:</Form.Label>

            <RandomizerSelect
                value={currentLayer.rateRandom ? currentLayer.rateRandom.type : 'value'}
                onChange={(selectedType: string) => handleRandomToggle('rate', selectedType)}
                options={NumericRandomizers} // options for randomizing
            />


            {renderRandomConfig('rate', currentLayer.rateRandom)}
            {!currentLayer.unitsRandom && (

                <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={currentLayer.dropoutRate || 0.5}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('dropoutRate', parseFloat(e.target.value))
                    }
                />
            )}
        </Form.Group>
        {InputsConst}
    </>
);
