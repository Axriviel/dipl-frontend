import React from "react";
import { Form } from "react-bootstrap";
import { IModelSettingsGA } from "../../Models/ModelSettingsGA";
import { HelpfulTip } from "../../../../features/Tooltip";

interface Props {
    gaSettings: IModelSettingsGA;
    updateGASettings: (e: any) => void;
}

const selectionMethods = ["Roulette", "Tournament", "Rank", "Random"];

export const GASettingsForm: React.FC<Props> = ({ gaSettings, updateGASettings }) => {
    return (
        <>
            <Form.Group controlId="formGAGenerations">
                <Form.Label>Generations <HelpfulTip text="Number of generations for which the evolutions should occur" /></Form.Label>
                <Form.Control
                    type="number"
                    name="generations"
                    value={gaSettings.generations}
                    onChange={updateGASettings}
                />
            </Form.Group>

            <Form.Group controlId="formGAPopulationSize">
                <Form.Label>Population Size <HelpfulTip text="How many models should exist in the population at the same time" /></Form.Label>
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
                <Form.Label>Mutation Rate <HelpfulTip text="Defines a chance for mutation to happen (results in changing model parameters)" /></Form.Label>
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

            <Form.Group controlId="formGAAdditionRate">
                <Form.Label>Addition rate <HelpfulTip text="Defines the ammount of models that will be added to population in each generation to freshen up the genomes (highly advised to use in tandem with growth limit functions)" /></Form.Label>
                <Form.Control
                    type="number"
                    step="1"
                    min="1"
                    max="20"
                    name="additionRate"
                    value={gaSettings.additionRate}
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
