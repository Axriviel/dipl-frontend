import React from "react";
import { Form } from "react-bootstrap";
import { NumericRandomizers, RandomConfig } from "../../LayerConfig";
import { RandomizerSelect } from "../RandomizerSelect";
import { IBatchNormalizationLayer } from "../../Models/BatchNormLayer";

interface BatchNormalizationLayerFormProps {
    currentLayer: IBatchNormalizationLayer;
    handleChange: (key: string, value: any) => void;
    handleRandomToggle: (key: string, type: string) => void;
    renderRandomConfig: (key: string, randomConfig: RandomConfig | undefined) => JSX.Element | null;
    InputsConst: JSX.Element;
}

export const BatchNormalizationLayerForm: React.FC<BatchNormalizationLayerFormProps> = ({
    currentLayer,
    handleChange,
    handleRandomToggle,
    renderRandomConfig,
    InputsConst,
}) => {
    return (
        <>
            {/* Momentum */}
            <Form.Group controlId={`momentum-${currentLayer.id}`}>
                <Form.Label>Momentum:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.momentumRandom ? currentLayer.momentumRandom.type : "value"}
                    onChange={(selectedType: string) => handleRandomToggle("momentum", selectedType)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig("momentum", currentLayer.momentumRandom)}
                {!currentLayer.momentumRandom && (
                    <Form.Control
                        type="number"
                        step="0.01"
                        value={currentLayer.momentum || 0.99}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("momentum", parseFloat(e.target.value))
                        }
                    />
                )}
            </Form.Group>

            {/* Epsilon */}
            <Form.Group controlId={`epsilon-${currentLayer.id}`}>
                <Form.Label>Epsilon:</Form.Label>
                <RandomizerSelect
                    value={currentLayer.epsilonRandom ? currentLayer.epsilonRandom.type : "value"}
                    onChange={(selectedType: string) => handleRandomToggle("epsilon", selectedType)}
                    options={NumericRandomizers}
                />
                {renderRandomConfig("epsilon", currentLayer.epsilonRandom)}
                {!currentLayer.epsilonRandom && (
                    <Form.Control
                        type="number"
                        step="1e-6"
                        value={currentLayer.epsilon || 1e-5}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("epsilon", parseFloat(e.target.value))
                        }
                    />
                )}
            </Form.Group>

            {/* Axis */}
            <Form.Group controlId={`axis-${currentLayer.id}`}>
                <Form.Label>Axis:</Form.Label>
                <Form.Control
                    type="number"
                    value={currentLayer.axis || -1}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange("axis", parseInt(e.target.value))
                    }
                />
            </Form.Group>

            {/* Center */}
            <Form.Group controlId={`center-${currentLayer.id}`}>
                <Form.Check
                    type="checkbox"
                    label="Center"
                    checked={currentLayer.center ?? true}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("center", e.target.checked)}
                />
            </Form.Group>

            {/* Scale */}
            <Form.Group controlId={`scale-${currentLayer.id}`}>
                <Form.Check
                    type="checkbox"
                    label="Scale"
                    checked={currentLayer.scale ?? true}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("scale", e.target.checked)}
                />
            </Form.Group>

            {InputsConst}
        </>
    );
};
