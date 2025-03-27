import { ChangeEvent, useCallback, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GASettingsForm } from "./Components/GASettingsForm";
import { NNISettingsForm } from "./Components/NNISettingsForm";
import { IModelParams } from "../Models/ModelParams";
import { availableMetrics, availableMonitorMetrics, lossFunctionOptions, optAlgorithmOptions, optimizerOptions } from "../../../config/config";
import { HelpfulTip } from "../../../features/Tooltip";
import { RandomizerSelect } from "./RandomizerSelect";
import { renderRandomConfig } from "./Randomness/RenderRandomConfig";
import { NumericRandomizers, RandomConfig, TextRandomizers } from "../Models/RandomConfigModels";
import { IModelSettings } from "../Models/ModelSettings";
import { TagsForm } from "../../../features/TagsForm";
import Tippy from "@tippyjs/react";
import { DebouncedNumberInput } from "../../../components/FormElements/DebouncedNumberInput";

interface Props {
    modelParams: IModelParams;
    setModelParams: React.Dispatch<React.SetStateAction<IModelParams>>;
    show: boolean;
    handleClose: () => void;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}


export const ModelConfigForm: React.FC<Props> = ({ modelParams, setModelParams, show, handleClose, tags, setTags }) => {
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

    const handleChange = (key: keyof IModelSettings | string, value: any) => {
        console.log(`Updating ${key} to`, value);

        setModelParams((prev) => {
            if (typeof key === "string" && key.includes("Random")) {
                const [randomKey, property] = key.split(".") as [keyof IModelSettings, string];

                if (!(randomKey in prev.settings)) {
                    console.error(`Key ${randomKey} does not exist in IModelSettings`);
                    return prev;
                }

                const randomConfig = (prev.settings[randomKey] as RandomConfig) || {}; // Zajištění správného typu

                const updatedRandomConfig = {
                    ...randomConfig,
                    [property]: value, // Aktualizuj specifickou vlastnost (např. options)
                };

                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        [randomKey]: updatedRandomConfig,
                    },
                };
            }

            // Normální aktualizace mimo random config
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

    const handleActivationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModelParams((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                optimizer: e.target.value,
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

    const handleDebouncedNumberChange = useCallback((key: keyof IModelSettings) => {
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
                            {optAlgorithmOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Select>
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
                        <Form.Label>Model Name <HelpfulTip text="Select unique model name. Keeping default results in randomly generated number behind the name." /></Form.Label>
                        <Form.Control
                            type="text"
                            name="model_name"
                            value={modelParams.settings.model_name}
                            onChange={updateSettings}
                        />
                    </Form.Group>


                    {/* Výběr optimalizátoru */}
                    <Form.Group controlId="formOptimizer">
                        <Form.Label>Optimizer</Form.Label>
                        {/* <Form.Select
                            name="optimizer"
                            value={modelParams.settings.optimizer}
                            onChange={updateSettings}
                        >
                            {optimizerOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Form.Select> */}

                        <RandomizerSelect
                            value={modelParams.settings.optimizerRandom ? modelParams.settings.optimizerRandom.type : 'value'}
                            onChange={(selectedType: string) => handleRandomToggle('optimizer', selectedType)}
                            options={TextRandomizers}
                        />
                        {/* {renderRandomConfig('activation', { type: "text", options: currentLayer.activationRandom.options })} */}

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

                    {/* select loss function */}
                    <Form.Group controlId="formLossFunction">
                        <Form.Label>Loss Function</Form.Label>
                        <Form.Select
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
                        {/* <Form.Control
                            type="number"
                            name="epochs"
                            value={modelParams.settings.epochs}
                            onChange={updateSettings}
                        /> */}
                        <RandomizerSelect
                            value={modelParams.settings.epochsRandom ? modelParams.settings.epochsRandom.type : 'value'}
                            onChange={(selectedType: string) => handleRandomToggle('epochs', selectedType)}
                            options={NumericRandomizers} // Můžeš předat jakýkoliv seznam možností
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
                        {/* <Form.Control
                            type="number"
                            name="batch_size"
                            value={modelParams.settings.batch_size}
                            onChange={updateSettings}
                        /> */}

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
                        <Form.Label>Limit - max models</Form.Label>
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
                    <Form.Group className="" controlId="tags">
                        <TagsForm tags={tags} setTags={setTags} />
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