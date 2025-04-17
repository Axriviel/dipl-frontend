import Tippy from "@tippyjs/react";
import { ChangeEvent, useCallback, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DebouncedNumberInput } from "../../../../components/FormElements/DebouncedNumberInput";
import { availableMetrics, availableMonitorMetrics, growthFunctionOptions, lossFunctionOptions, optAlgorithmAutoOptions, optimizerOptions } from "../../../../config/config";
import { HelpfulTip } from "../../../../features/Tooltip";
import { GASettingsForm } from "../../../TestPage/Features/Components/GASettingsForm";
import { RandomizerSelect } from "../../../TestPage/Features/RandomizerSelect";
import { renderRandomConfig } from "../../../TestPage/Features/Randomness/RenderRandomConfig";
import { NumericRandomizers, RandomConfig, TextRandomizers } from "../../../TestPage/Models/RandomConfigModels";
import { IAutoTaskState } from "../../Models/AutoTask";
import { IModelAutoSettings } from "../../Models/ModelAutoSettings";

interface Props {
    modelParams: IAutoTaskState;
    setModelParams: React.Dispatch<React.SetStateAction<IAutoTaskState>>;
    show: boolean;
    handleClose: () => void;
}


export const AutoModelConfigForm: React.FC<Props> = ({ modelParams, setModelParams, show, handleClose }) => {
    const [useTimer, setUseTimer] = useState<boolean>(false)

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

    const handleChange = (key: keyof IModelAutoSettings | string, value: any) => {
        console.log(`Updating ${key} to`, value);

        setModelParams((prev) => {
            if (typeof key === "string" && key.includes("Random")) {
                const [randomKey, property] = key.split(".") as [keyof IModelAutoSettings, string];

                if (!(randomKey in prev.settings)) {
                    console.error(`Key ${randomKey} does not exist in IModelSettings`);
                    return prev;
                }

                const randomConfig = (prev.settings[randomKey] as RandomConfig) || {};

                const updatedRandomConfig = {
                    ...randomConfig,
                    [property]: value,
                };

                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        [randomKey]: updatedRandomConfig,
                    },
                };
            }

            if (key in prev.settings) {
                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        [key]: value,
                    },
                };
            }

            console.error(`Key ${key} does not exist in IModelSettings`);
            return prev;
        });
    };

    const handleRandomToggle = (key: string, type: string) => {
        setModelParams((prev) => {
            const randomEnabled = prev.settings.hasOwnProperty(`${key}Random`);
            console.log("Current randomEnabled:", randomEnabled);
            console.log("nastavuji " + key + " na " + type);

            if (type === 'value') {
                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        [`${key}Random`]: undefined,
                    }
                };
            }

            return {
                ...prev,
                settings: {
                    ...prev.settings,
                    [`${key}Random`]: randomEnabled
                        ? (() => {
                            switch (type) {
                                case 'numeric':
                                    return { type: 'numeric', min: 1, max: 100, step: 1 };
                                case 'numeric-test':
                                    return { type: 'numeric-test', min: 1, max: 100 };
                                case 'text':
                                    return { type: 'text', options: ['option1', 'option2'] };
                                default:
                                    throw new Error(`Unsupported type: ${type}`);
                            }
                        })()
                        : undefined
                }
            };
        });
    };

    const handleMetricsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const updatedMetrics = checked
            ? [...modelParams.settings.metrics, value]  // add metric
            : modelParams.settings.metrics.filter(metric => metric !== value);  // remove one

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

    const handleActivationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModelParams((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                optimizer: e.target.value,
            },
        }));
    };

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

                    {/* Genetics specific section */}
                    {modelParams.settings.opt_algorithm === "genetic" && (
                        <GASettingsForm
                            gaSettings={modelParams.settings.GA}
                            updateGASettings={(e) => updateOptimizerSpecificSettings(e, "GA")}
                        />
                    )}

                    <Form.Group controlId="formOptimizer">
                        <Form.Label>Optimizer</Form.Label>
                        <RandomizerSelect
                            value={modelParams.settings.optimizerRandom ? modelParams.settings.optimizerRandom.type : 'value'}
                            onChange={(selectedType: string) => handleRandomToggle('optimizer', selectedType)}
                            options={TextRandomizers}
                        />

                        {/* prvním parametrem je prvek, který bude randomizován a druhým je proměnná v currentLayer, do které se to ukládá */}
                        {renderRandomConfig('optimizer', modelParams.settings.optimizerRandom, handleChange)}
                        {!modelParams.settings.optimizerRandom && (
                            <Form.Select
                                as="select"
                                value={modelParams.settings.optimizer || ''}
                                onChange={handleActivationChange}
                            >
                                {optimizerOptions.map((fn) => (
                                    <option key={fn} value={fn}>
                                        {fn}
                                    </option>
                                ))}
                            </Form.Select>
                        )}
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

                    <Form.Group controlId="limit_growth">
                        <Form.Label>Limit growth Function <HelpfulTip text="Function defining how fast the model reaches the maximum limit (e.g. 1 to 100 units in dense layer will start smaller for some time and grow up to 100)" /></Form.Label>
                        <Form.Select
                            name="limit_growth"
                            value={modelParams.settings.limit_growth}
                            onChange={updateSettings}
                        >
                            {growthFunctionOptions.map(gfo => (
                                <option key={gfo} value={gfo}>{gfo}</option>
                            ))}

                        </Form.Select>
                    </Form.Group>

                    {/* Checkbox for metrics */}
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

                    {/* epoch and batch size */}
                    <Form.Group controlId="formEpochs">
                        <Form.Label>Epochs</Form.Label>
                        <RandomizerSelect
                            value={modelParams.settings.epochsRandom ? modelParams.settings.epochsRandom.type : 'value'}
                            onChange={(selectedType: string) => handleRandomToggle('epochs', selectedType)}
                            options={NumericRandomizers}
                        />


                        {renderRandomConfig('epochs', modelParams.settings.epochsRandom, handleChange)}
                        {!modelParams.settings.epochsRandom && (
                            <Form.Control
                                type="number"
                                name="epochs"
                                value={modelParams.settings.epochs || 10}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('epochs', parseInt(e.target.value))}
                            />
                        )}
                    </Form.Group>
                    <Form.Group controlId="formBatchSize">
                        <Form.Label>Batch Size</Form.Label>


                        <RandomizerSelect
                            value={modelParams.settings.batch_sizeRandom ? modelParams.settings.batch_sizeRandom.type : "value"}
                            onChange={(selectedType: string) => handleRandomToggle("batch_size", selectedType)}
                            options={NumericRandomizers}
                        />
                        {renderRandomConfig("batch_size", modelParams.settings.batch_sizeRandom, handleChange)}
                        {!modelParams.settings.batch_sizeRandom && (
                            <Form.Control
                                type="number"
                                name="batch_size"
                                value={modelParams.settings.batch_size}
                                onChange={updateSettings}
                            />
                        )}
                    </Form.Group>
                    <Form.Group controlId="max_models">
                        <Form.Label>Max models <HelpfulTip text="How many models should be created in the process of optimization (is overriden by specific genetic settings)"/></Form.Label>
                        <Form.Control
                            type="number"
                            name="max_models"
                            min={1}
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
                                <Form.Label>Timeout (seconds) <HelpfulTip text="When the time is up, the best currently found model is returned and the task is terminated"/></Form.Label>
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
                    <Form.Group controlId="k_fold">
                        <Form.Label>N-training <HelpfulTip text="Defines how many times should model be trained to verify its performance. May significantly increase computation time" /></Form.Label>
                        <Form.Control
                            type="number"
                            name="k_fold"
                            min={1}
                            max={5}
                            value={modelParams.settings.k_fold}
                            onChange={updateSettings}
                        />
                    </Form.Group>
                    <Form.Group controlId="es_threshold">
                        <Form.Label>ES threshold <HelpfulTip text="Threshold defining the minimum required metric to continue multiple trainings" /></Form.Label>
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