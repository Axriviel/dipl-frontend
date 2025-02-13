import { ChangeEvent } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GASettingsForm } from "./Components/GASettingsForm";
import { NNISettingsForm } from "./Components/NNISettingsForm";
import { IModelParams } from "../Models/ModelParams";
import { availableMetrics, availableMonitorMetrics, lossFunctionOptions, optAlgorithmOptions, optimizerOptions } from "../../../config/config";

interface Props {
    modelParams: IModelParams;
    setModelParams: React.Dispatch<React.SetStateAction<IModelParams>>;
    show: boolean;
    handleClose: () => void;
}


export const ModelConfigForm: React.FC<Props> = ({ modelParams, setModelParams, show, handleClose }) => {

    // Funkce pro aktualizaci nastavení
    const updateSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setModelParams(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [name]: name === "epochs" || name === "batch_size" || name === "max_models" ? parseInt(value, 10) :
                    name === "es_threshold" ? parseFloat(value) : value
            }
        }));
    };


    // // Funkce pro aktualizaci specifických NNI nastavení
    // const updateNNISettings = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     const parsedValue = name === "nni_max_trials" || name === "nni_concurrency" ? Number(value) : value;

    //     setModelParams(prev => ({
    //         ...prev,
    //         settings: {
    //             ...prev.settings,
    //             NNI: {
    //                 ...prev.settings.NNI,
    //                 [name]: parsedValue
    //             }
    //         }
    //     }));
    // };
    // Funkce pro aktualizaci specifických NNI nastavení
    const updateOptimizerSpecificSettings = (
        e: any,
        section: "NNI" | "GA"
    ) => {
        const { name, value } = e.target;
        const parsedValue =
            ["nni_max_trials", "nni_concurrency", "generations", "populationSize", "numParents"].includes(name)
                ? Number(value)
                : name === "mutationRate"
                    ? parseFloat(value)
                    : value;

        setModelParams(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [section]: {
                    ...prev.settings[section],
                    [name]: parsedValue,
                },
            },
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
                            updateNNISettings={(e) => updateOptimizerSpecificSettings(e, "NNI")}
                        />
                    )}

                    {/* Genetics specific section */}
                    {modelParams.settings.opt_algorithm === "genetic" && (
                        <GASettingsForm
                            gaSettings={modelParams.settings.GA}
                            updateGASettings={(e) => updateOptimizerSpecificSettings(e, "GA")}
                        />
                    )}


                    <Form.Group controlId="modelName">
                        <Form.Label>Model Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="model_name"
                            value={modelParams.settings.model_name}
                            onChange={updateSettings}
                        />
                        <Form.Text className="text-muted">
                            Enter a unique name for your model.
                        </Form.Text>
                    </Form.Group>


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
                    <Form.Group controlId="max_models">
                        <Form.Label>Limit - max models</Form.Label>
                        <Form.Control
                            type="number"
                            name="max_models"
                            value={modelParams.settings.max_models}
                            onChange={updateSettings}
                        />
                    </Form.Group>
                    <Form.Group controlId="es_threshold">
                        <Form.Label>ES threshold</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="es_threshold"
                            value={modelParams.settings.es_threshold}
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