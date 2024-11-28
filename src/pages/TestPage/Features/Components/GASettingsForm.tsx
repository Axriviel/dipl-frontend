import React from "react";
import { Form } from "react-bootstrap";
import { IModelSettingsGA } from "../../Models/ModelSettingsGA";

interface Props {
    gaSettings: IModelSettingsGA;
    updateGASettings: (e: any) => void;
}

const selectionMethods = ["Roulette", "Tournament", "Rank", "Random"];

export const GASettingsForm: React.FC<Props> = ({ gaSettings, updateGASettings }) => {
    return (
        <>
            <Form.Group controlId="formGAGenerations">
                <Form.Label>Generations</Form.Label>
                <Form.Control
                    type="number"
                    name="generations"
                    value={gaSettings.generations}
                    onChange={updateGASettings}
                />
            </Form.Group>

            <Form.Group controlId="formGAPopulationSize">
                <Form.Label>Population Size</Form.Label>
                <Form.Control
                    type="number"
                    name="populationSize"
                    value={gaSettings.populationSize}
                    onChange={updateGASettings}
                />
            </Form.Group>

            <Form.Group controlId="formGANumParents">
                <Form.Label>Number of Parents</Form.Label>
                <Form.Control
                    type="number"
                    name="numParents"
                    value={gaSettings.numParents}
                    onChange={updateGASettings}
                />
            </Form.Group>

            <Form.Group controlId="formGAMutationRate">
                <Form.Label>Mutation Rate</Form.Label>
                <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    name="mutationRate"
                    value={gaSettings.mutationRate}
                    onChange={updateGASettings}
                />
            </Form.Group>

            <Form.Group controlId="formGASelectionMethod">
                <Form.Label>Selection Method</Form.Label>
                <Form.Control
                    as="select"
                    name="selectionMethod"
                    value={gaSettings.selectionMethod}
                    onChange={updateGASettings}
                >
                    {selectionMethods.map(method => (
                        <option key={method} value={method}>
                            {method}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
        </>
    );
};
