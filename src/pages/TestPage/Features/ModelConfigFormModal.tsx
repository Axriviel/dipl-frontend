import { Button, Form, Modal } from "react-bootstrap";
import { ModelParams } from "../ModelConfig";
import { ChangeEvent } from "react";
import { NNISettingsForm } from "./Components/NNISettingsForm";

interface Props {
    modelParams: ModelParams;
    setModelParams: React.Dispatch<React.SetStateAction<ModelParams>>;
    show: boolean;
    handleClose: () => void;
}

const optAlgorithmOptions = ["random", "genetic", "nni"];

const optimizerOptions = [
    'SGD', 'RMSprop', 'Adam', 'AdamW', 'Adadelta',
    'Adagrad', 'Adamax', 'Adafactor', 'Nadam',
    'Ftrl', 'Lion', 'Lamb', 'Loss Scale Optimizer'
];

const lossFunctionOptions = [
    "binary_crossentropy", "categorical_crossentropy", "mean_squared_error",
]

const availableMonitorMetrics = [
    'accuracy', 'val_accuracy', 'precision', 'val_precision',
    'recall', 'val_recall', 'AUC', 'val_AUC', 'mean_squared_error', 'val_mean_squared_error'
];

const availableMetrics = [
    'accuracy', 'precision', 'recall', 'f1-score', 'AUC', 'mean_squared_error'
];

export const ModelConfigForm: React.FC<Props> = ({ modelParams, setModelParams, show, handleClose }) => {

    // Funkce pro aktualizaci nastavení
    const updateSettings = (e: any) => {
        const { name, value } = e.target;
        setModelParams(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [name]: value
            }
        }));
    };

    // Funkce pro aktualizaci specifických NNI nastavení
    const updateNNISettings = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === "nni_max_trials" || name === "nni_concurrency" ? Number(value) : value;

        setModelParams(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                NNI: {
                    ...prev.settings.NNI,
                    [name]: parsedValue
                }
            }
        }));
    };

    // Funkce pro výběr metrik pomocí checkboxů
    const handleMetricsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const updatedMetrics = checked
            ? [...modelParams.settings.metrics, value]  // Přidání metriky
            : modelParams.settings.metrics.filter(metric => metric !== value);  // Odebrání metriky

        setModelParams(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                metrics: updatedMetrics
            }
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Model Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* choose optimization algorithm */}
                    <Form.Group controlId="formOptimizer">
                        <Form.Label>Opt Algorithm</Form.Label>
                        <Form.Control
                            as="select"
                            name="opt_algorithm"
                            value={modelParams.settings.opt_algorithm}
                            onChange={updateSettings}
                        >
                            {optAlgorithmOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {/* Specifická sekce pro NNI */}
                    {modelParams.settings.opt_algorithm === "nni" && (
                        <NNISettingsForm
                            nniSettings={modelParams.settings.NNI}
                            updateNNISettings={updateNNISettings}
                        />
                    )}

                    {/* Výběr optimalizátoru */}
                    <Form.Group controlId="formOptimizer">
                        <Form.Label>Optimizer</Form.Label>
                        <Form.Control
                            as="select"
                            name="optimizer"
                            value={modelParams.settings.optimizer}
                            onChange={updateSettings}
                        >
                            {optimizerOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {/* select loss function */}
                    <Form.Group controlId="formLossFunction">
                        <Form.Label>Loss Function</Form.Label>
                        <Form.Control
                            as="select"
                            name="loss"
                            value={modelParams.settings.loss}
                            onChange={updateSettings}
                        >
                            {lossFunctionOptions.map(lfo => (
                                <option key={lfo} value={lfo}>{lfo}</option>
                            ))}

                        </Form.Control>
                    </Form.Group>

                    {/* Checkboxy pro výběr metrik */}
                    <Form.Group controlId="formMetrics">
                        <Form.Label>Metrics</Form.Label>
                        {availableMetrics.map(metric => (
                            <Form.Check
                                key={metric}
                                type="checkbox"
                                label={metric}
                                value={metric}
                                checked={modelParams.settings.metrics.includes(metric)}
                                onChange={handleMetricsChange}
                            />
                        ))}
                    </Form.Group>
                    {/* Výběr monitorovací metriky */}
                    <Form.Group controlId="formMonitorMetric">
                        <Form.Label>Monitor Metric</Form.Label>
                        <Form.Control
                            as="select"
                            name="monitor_metric"
                            value={modelParams.settings.monitor_metric}
                            onChange={updateSettings}
                        >
                            {/* filter the options for the metric needs to be selected in compile to be usable here */}
                            {availableMonitorMetrics
                                .filter(metric =>
                                    modelParams.settings.metrics.includes(metric.replace("val_", "")) ||
                                    modelParams.settings.metrics.includes(metric)
                                )
                                .map(metric => (
                                    <option key={metric} value={metric}>{metric}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>

                    {/* Nastavení epoch a batch size */}
                    <Form.Group controlId="formEpochs">
                        <Form.Label>Epochs</Form.Label>
                        <Form.Control
                            type="number"
                            name="epochs"
                            value={modelParams.settings.epochs}
                            onChange={updateSettings}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBatchSize">
                        <Form.Label>Batch Size</Form.Label>
                        <Form.Control
                            type="number"
                            name="batch_size"
                            value={modelParams.settings.batch_size}
                            onChange={updateSettings}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};