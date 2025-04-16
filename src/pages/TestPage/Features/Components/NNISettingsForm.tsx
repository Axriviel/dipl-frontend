import React from "react";
import { Form } from "react-bootstrap";
import { IModelSettingsNNI } from "../../Models/ModelSettingsNNI";
import { HelpfulTip } from "../../../../features/Tooltip";

interface Props {
    nniSettings: IModelSettingsNNI;
    updateNNISettings: (e: any) => void;
}

const nniTunerOptions = ["TPE", "Random", "Evolution"];

export const NNISettingsForm: React.FC<Props> = ({ nniSettings, updateNNISettings }) => {
    return (
        <>
            <Form.Group controlId="formNNIMaxTrials">
                <Form.Label>Max Trials <HelpfulTip text="How many models (trials) should be made in the process" /></Form.Label>
                <Form.Control
                    type="number"
                    name="nni_max_trials"
                    value={nniSettings.nni_max_trials}
                    onChange={updateNNISettings}
                />
            </Form.Group>

            <Form.Group controlId="formNNIConcurrency">
                <Form.Label>Concurrency <HelpfulTip text="How many models can be made at the same time" /></Form.Label>
                <Form.Control
                    type="number"
                    name="nni_concurrency"
                    value={nniSettings.nni_concurrency}
                    onChange={updateNNISettings}
                />
            </Form.Group>

            <Form.Group controlId="formNNITuner">
                <Form.Label>NNI Tuner <HelpfulTip text="Select an algorithm for the approach of optimizing the models" /></Form.Label>
                <Form.Select
                    as="select"
                    name="nni_tuner"
                    value={nniSettings.nni_tuner}
                    onChange={updateNNISettings}
                >
                    {nniTunerOptions.map(tuner => (
                        <option key={tuner} value={tuner}>{tuner}</option>
                    ))}
                </Form.Select>
            </Form.Group>
        </>
    );
};
