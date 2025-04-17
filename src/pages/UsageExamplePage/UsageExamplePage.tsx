
import dataset_config from "../../assets/usagePageImages/dataset_config.PNG"
import model_settings from "../../assets/usagePageImages/model_settings.PNG"
import auto_design from "../../assets/usagePageImages/automated_design.PNG"
import semi_design from "../../assets/usagePageImages/semi_design.PNG"
import layer_modal from "../../assets/usagePageImages/layer_modal.PNG"
import generator_modal from "../../assets/usagePageImages/ukazka-generator-modal.PNG"
import models_page from "../../assets/usagePageImages/models-page.PNG"
import "./UsageExamplePage.css";

export const UsageExamplePage = () => {
    return (
        <div className="usage-page container py-4">
            <h1 className="text-center mb-4">Using the Application</h1>

            <section>
                <h2>1. Task Overview</h2>
                <p>
                    This example demonstrates how to use the application for a <strong>binary classification</strong> task,
                    using the well-known <em>Pima Indians Diabetes</em> dataset. The dataset contains 8 feature columns and one label
                    column indicating whether the person was infected or not.
                </p>
            </section>

            <section>
                <h2>2. Dataset Upload</h2>
                <p>
                    Begin by uploading your dataset on the <strong>Datasets</strong> page using the <em>“Upload Dataset”</em> button.
                    Once uploaded, you can click on the dataset name to view basic information such as the number of rows, columns, and detected datatypes.
                </p>
            </section>

            <section>
                <h2>3. Choosing a Design Approach</h2>
                <p>
                    Proceed to the <strong>Designer</strong> page. Here, choose between two approaches:
                </p>
                <ul>
                    <li><strong>Automated Design</strong> – for users who prefer automatic architecture creation including layer parameters.</li>
                    <li><strong>Semi-Automated Design</strong> – for users who want more control over layers, structure, and parameters.</li>
                </ul>
            </section>

            <section>
                <h2>4. Dataset Configuration</h2>
                <p>
                    After clicking the <strong>“Dataset Config”</strong> button, a modal window appears to configure dataset-related details:
                </p>
                <ul>
                    <li><strong>Input Columns (X):</strong> select which columns are used as features.</li>
                    <li><strong>Output Columns (Y):</strong> define which columns represent labels.</li>
                    <li><strong>Test Size:</strong> specify the train/test split ratio (e.g., 0.2 = 80% training, 20% testing).</li>
                    <li><strong>One-Hot Encoding:</strong> optionally select categorical columns to encode.</li>
                </ul>
                <img src={dataset_config} alt="Dataset config" className="usage-img" />
            </section>

            <section>
                <h2>5. Model Settings</h2>
                <p>
                    After clicking <strong>“Model Settings”</strong>, a modal opens where model parameters can be configured:
                </p>
                <ul>
                    <li>Select optimization algorithm (e.g., Random Search, Genetic Algorithm).</li>
                    <li>Set a custom model name.</li>
                    <li>Choose optimizer, loss function, and evaluation metrics.</li>
                    <li>Select a monitor metric (enabled after choosing at least one metric).</li>
                    <li>Configure training parameters: epochs, batch size, max models.</li>
                    <li>Optionally add a time limit for model creation.</li>
                    <li>
                        Set a growth limit function to control how model complexity grows over time
                        (<code>none</code>, <code>linear</code>, <code>log</code>, <code>square</code>).
                    </li>
                    <li>Define an early stopping threshold.</li>
                    <li>
                        If using certain algorithms, extra fields appear, that are necessary to set the algorithm up.
                    </li>
                </ul>
                <img src={model_settings} alt="Model settings" className="usage-img" />
            </section>

            <section>
                <h2>6. Automated Design</h2>
                <p>
                    In the automated design mode, select your task type (e.g., Binary Classification), dataset, model depth,
                    and optionally enter custom tags. Then press <strong>“Submit Model”</strong> to start the optimization.
                    After completion, a notification appears and results can be reviewed.
                </p>
                <img src={auto_design} alt="Automated design" className="usage-img" />
            </section>

            <section>
                <h2>7. Semi-Automated Design</h2>
                <img src={semi_design} alt="Semi-automated designer" className="usage-img" />
                <p>
                    The semi-automated designer offers visual editing of the model:
                </p>
                <ul>
                    <li><strong>Left:</strong> Graph of the model, fully editable (drag, reorder, connect layers).</li>
                    <li><strong>Right (top):</strong> Dataset selector and configuration buttons.</li>
                    <li><strong>Right (bottom):</strong> Table of added layers with <em>Edit</em> and <em>Remove</em> options.</li>
                </ul>
                <p>
                    Use the <strong>“Download JSON”</strong> button to export the design. To submit it, click <strong>“Submit Model”</strong>.
                </p>

                <img src={layer_modal} alt="Layer configuration modal" className="usage-img" />
                <p>
                    Clicking a layer opens a modal window to configure (some examples, the exact items depend on the layer):
                </p>
                <ul>
                    <li>Layer name</li>
                    <li>Number of neurons (fixed or randomized)</li>
                    <li>Activation function (fixed or randomized from a list)</li>
                    <li>Inputs – the preceding layers this one connects to</li>
                </ul>
            </section>

            <section>
                <h2>8. Generator Layer</h2>
                <p>
                    The generator layer creates a group of layers based on settings such as:
                </p>
                <ul>
                    <li>Number of generated layers (fixed or randomized)</li>
                    <li>List of possible layer types (editable after adding)</li>
                    <li>Each layer includes a <strong>“Possible Follows”</strong> field to define valid successors</li>
                    <li>Starting layer – defines where generation begins</li>
                </ul>
                <img src={generator_modal} alt="Generator layer" className="usage-img" />
            </section>

            <section>
                <h2>9. Viewing Results</h2>
                <p>
                    Once the model is created, visit the <strong>“Models”</strong> page to view the results. You can:
                </p>
                <ul>
                    <li>Switch between your saved models</li>
                    <li>Delete or download a model as a <code>.keras</code> file</li>
                    <li>Use Keras’ <code>load_model()</code> function to load it for use</li>
                    <li>Open modals with detailed model information</li>
                </ul>
                <img src={models_page} alt="Models page" className="usage-img" />
            </section>
        </div>
    )
}
