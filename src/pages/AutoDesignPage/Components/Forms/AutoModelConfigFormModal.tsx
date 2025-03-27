import { ChangeEvent, useCallback, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { availableMetrics, availableMonitorMetrics, lossFunctionOptions, optAlgorithmAutoOptions, optimizerOptions } from "../../../../config/config";
import { GASettingsForm } from "../../../TestPage/Features/Components/GASettingsForm";
import { IAutoTaskState } from "../../Models/AutoTask";
import { HelpfulTip } from "../../../../features/Tooltip";
import Tippy from "@tippyjs/react";
import { DebouncedNumberInput } from "../../../../components/FormElements/DebouncedNumberInput";
import { IModelAutoSettings } from "../../Models/ModelAutoSettings";

interface Props {
    modelParams: IAutoTaskState;
    setModelParams: React.Dispatch<React.SetStateAction<IAutoTaskState>>;
    show: boolean;
    handleClose: () => void;
}


export const AutoModelConfigForm: React.FC<Props> = ({ modelParams, setModelParams, show, handleClose }) => {
    const [useTimer, setUseTimer] = useState<boolean>(false)

    // Funkce pro aktualizaci nastavení
    const updateSettings = (e: any) => {
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
    const handleUseTimer = () => {
        setUseTimer((prev) => !prev)
        console.log("setting timer to", !useTimer)
        setModelParams((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                use_timeout: !useTimer,
            },
        }));
    }
    const handleDebouncedNumberChange = useCallback((key: keyof IModelAutoSettings) => {
        return (value: number) => {
            console.log("setting", key, "to", value)
            setModelParams((prev) => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [key]: value,
                }
            }));
        };
    }, []);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Model Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="custom-form">
                    {/* choose optimization algorithm */}
                    <Form.Group controlId="formOptimizer">
                        <Form.Label>Opt Algorithm <HelpfulTip text="Choose the approach for optimization" /></Form.Label>
                        <Form.Select
                            as="select"
                            name="opt_algorithm"
                            value={modelParams.settings.opt_algorithm}
                            onChange={updateSettings}
                        >
                            {optAlgorithmAutoOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Specifická sekce pro NNI */}
                    {/* {modelParams.settings.opt_algorithm === "nni" && (
                        <NNISettingsAutoForm
                            nniSettings={modelParams.settings.NNI}
                            updateNNISettings={(e) => updateOptimizerSpecificSettings(e, "NNI")}
                        />
                    )} */}

                    {/* Genetics specific section */}
                    {modelParams.settings.opt_algorithm === "genetic" && (
                        <GASettingsForm
                            gaSettings={modelParams.settings.GA}
                            updateGASettings={(e) => updateOptimizerSpecificSettings(e, "GA")}
                        />
                    )}

                    {/* Výběr optimalizátoru */}
                    <Form.Group controlId="formOptimizer">
                        <Form.Label>Optimizer</Form.Label>
                        <Form.Select
                            as="select"
                            name="optimizer"
                            value={modelParams.settings.optimizer}
                            onChange={updateSettings}
                        >
                            {optimizerOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="modelName">
                        <Form.Label>Model Name <HelpfulTip text="Select unique model name. Keeping default results in randomly generated number behind the name." /></Form.Label>
                        <Form.Control
                            type="text"
                            name="model_name"
                            value={modelParams.settings.model_name}
                            onChange={updateSettings}
                        />
                    </Form.Group>

                    {/* select loss function */}
                    <Form.Group controlId="formLossFunction">
                        <Form.Label>Loss Function</Form.Label>
                        <Form.Select
                            as="select"
                            name="loss"
                            value={modelParams.settings.loss}
                            onChange={updateSettings}
                        >
                            {lossFunctionOptions.map(lfo => (
                                <option key={lfo} value={lfo}>{lfo}</option>
                            ))}

                        </Form.Select>
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
                        <Form.Select
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
                        </Form.Select>
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

                    <Form.Group controlId="formBatchSize">
                        <Form.Label>Max models</Form.Label>
                        <Form.Control
                            type="number"
                            name="max_models"
                            value={modelParams.settings.max_models}
                            onChange={updateSettings}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Tippy content="Limit time for which optimization can run in seconds">
                            <Form.Check
                                type="checkbox"
                                label="Use timeout"
                                checked={useTimer}
                                onChange={handleUseTimer}
                            />
                        </Tippy>

                        {useTimer && (
                            <>
                                <Form.Label>Timeout (seconds):</Form.Label>
                                <DebouncedNumberInput
                                    value={modelParams.settings.timeout || 0}
                                    onChange={handleDebouncedNumberChange("timeout")}
                                    timeout={500}
                                    placeholder="Enter timeout in seconds"
                                    min={10}
                                    step={10}
                                />
                            </>
                        )}
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