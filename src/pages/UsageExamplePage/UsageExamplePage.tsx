// import dataset_config from "../../assets/usagePageImages/dataset_config.PNG"
// import model_settings from "../../assets/usagePageImages/model_settings.PNG"
// import auto_design from "../../assets/usagePageImages/automated_design.PNG"
// import semi_design from "../../assets/usagePageImages/semi_design.PNG"
// import layer_modal from "../../assets/usagePageImages/layer_modal.PNG"
// import generator_modal from "../../assets/usagePageImages/ukazka-generator-modal.PNG"
// import models_page from "../../assets/usagePageImages/models-page.PNG"
// import "./UsageExamplePage.css";


// export const UsageExamplePage = () => {
//     return (
//         <div className="d-flex flex-column align-items-center m-2">
//             <h1>Simple example of using the app</h1>
//             <p>
//                 On this page is a simple example of application usage. I will be demonstrating it with a binary classification task using "Pima indians diabates" dataset, which contains 8 columns of features and 1 label column which says whether the person was infected or not. So lets get started.
//             </p>

//             <ul>
//                 <li>First step is to upload the dataset using the "Datasets" page via "upload dataset button". Once uploaded you can also click your dataset to receive some basic information about it.</li>
//                 <li>Then you may proceed to "Designer" page, where you shall select whether you wish to use Automated or Semi automated approach. If you want more control over the model, its parameters and structure, you should use semi automated approach. If you do not or wish for the architecture to be selected for you, use the automated approach.</li>
//             </ul>
//             <h2>Settings forms</h2>
//             <p>The "Dataset Config" and "Model Settings" forms, which appear in modal windows upon pressing their respective buttons, are described in this section. Since these forms are shared across both model design approaches (with some form field exceptions in that differ), there is no need to describe them separately for each designer.</p>
//             <h3>Dataset config</h3>
//             This section, accessible via the "Dataset Config" button, allows the user to configure additional dataset-related settings. An example of the modal window is shown on the picture below.

//             The first input is Input Columns (X), where the user can define which columns should be treated as features. The Output Columns (Y) input specifies which columns represent the labels.

//             The Test Size field determines how the dataset should be split into training and testing subsets. For example, a value of 0.2 means 80% of the data will be used for training and 20% for testing.

//             Lastly, there are options to manually define which columns should be encoded using One-Hot Encoding, in case categorical data is present and preprocessing is needed.
//             <img src={dataset_config}></img>
//             <h3>Model settings form</h3>
//             The Model Settings modal opens when the corresponding button is pressed. It provides a comprehensive set of parameters required for model construction and optimization on the backend.

//             An example of part of this window is shown on the image below. The configuration begins with selecting an Optimization Algorithm.

//             Next, the user defines the Model Name, which will be used to identify the model in the Models section.

//             The user must then choose a Keras Optimizer, a Loss Function, and one or more Metrics. Metrics are selected via checkboxes. Once metrics are chosen, they unlock the ability to choose a Monitor Metric — meaning, a monitor metric can only be selected if it's already included among the selected metrics.

//             The modal also includes several numerical inputs:

//             Epochs: The number of training epochs (default: 10).

//             Batch Size: The batch size used during training.

//             Max Models: The maximum number of models to generate, train, and compare (default: 5).

//             Time Limit: When this checkbox is enabled, a new field appears where the user can enter a time limit in seconds. Once the limit is reached, the process stops and returns the best model found so far.

//             An important option is the Growth Limit function, which controls the upper bounds for randomly chosen parameters and gradually increases them throughout the optimization process. In effect, this allows the optimization to begin with simpler models (e.g., fewer neurons or layers) and gradually explore more complex ones. Available options:

//             none: No change in parameter limits over time.

//             linear: Limits grow at a constant rate.

//             log: Fast growth early on, then slowing down.

//             square: Slow initial growth, accelerating toward the end.

//             The final setting is a Floating-Point Threshold for early stopping, which determines when the optimization process should stop if improvement becomes negligible.

//             Additional form elements appear conditionally based on the selected optimization algorithm. For instance, when the Genetic Algorithm is selected, extra fields become visible. These may include:

//             Number of Generations

//             Population Size

//             Number of Parents per Offspring

//             Mutation Probability

//             Parent Selection Method
//             <img src={model_settings}></img>

//             <h2>Automated design</h2>
//             When opting for a fully automated model design, the user navigates to the corresponding designer section. At this point, it is necessary to fill in the required form fields. An example of such a configuration is shown on the image below.

//             The first input defines the type of task — in this case, we select Binary Classification from the dropdown menu. Next, we choose the uploaded dataset from the second select box. Then we can specify the depth of the model, which defines how many layers can it contain at most. Optionally, the user can enhance the current task by adding custom tags, which are particularly useful when using the tag-based optimization method.

//             Once the "Submit Model" button is pressed, the configuration is sent to the server, which initiates the optimization process. After receiving a confirmation alert or notification that the process has completed, the user can proceed to view the results.

//             <img src={auto_design}></img>

//             <h2>Semi automated designer</h2>
//             <img src={semi_design}></img>

//             We will start with the image this time of how the designer looks.
//             On the left side of the screen, there is a visual representation of the model being designed. Users can freely manipulate the structure: rearranging elements, adjusting connections between layers, and shaping the architecture as needed. At the bottom of this section, there is a "Download JSON" button, which allows the current model design to be downloaded as a JSON file. This enables users to save their progress and return to it later using the utility config.

//             On the right side of the screen, the top half contains configuration tools. At the top, there is a select box for choosing the dataset that will be used for the given task. Below that, several buttons provide access to configuration forms and settings, which were described earlier.

//             An essential element located to the left of the configuration buttons is the layer selection box, which allows users to choose a layer type to add to the model. After selecting a layer and clicking the "Add Layer" button, the layer is inserted into the visual graph and also appears in a table listing all added layers.

//             This layer table is located in the bottom half of the right panel. Each layer in the list includes two action buttons:

//             "Remove", which deletes the layer from the model,

//             "Edit", which opens a modal window for configuring the selected layer.
//             A description and example of such a window can be found below.

//             Beneath the table, there is a "Submit Model" button. When clicked, it sends the entire JSON model configuration — including all layers and parameters — to the server for processing. An informational alert confirms the submission. Once processing is complete, the user receives a success alert and a notification confirming that the model was successfully created. The model then becomes available in the "Models" section.

//             <img src={layer_modal}></img>

//             When clicking on any layer in the graphical model view or in the layer list table, a modal window appears for editing that layer’s configuration. This modal includes various settings depending on the layer type. For example, the modal for a Dense layer is shown on the image below. As illustrated, users can configure:

//             the layer name,

//             the number of neurons (either as a fixed number or via randomization, with customizable min/max values and step),

//             the activation function (which can also be randomized from a list of options),

//             and the Inputs, which specify the preceding layer(s) this layer connects to.

//             <h2>Generator layer</h2>
//             As part of the demonstration, I also included a generator layer, whose configuration can be seen on image below. In addition to the previously mentioned fields such as name and inputs, this layer contains several specific settings:

//             Number of Generated Layers: Defines how many layers the generator should create. This number can also be randomized.

//             Definition of Possible Layers: Through a select box, users can choose from all supported layer types and add them to the generator. The list of added layers is displayed in a table, and each can be removed or configured individually.

//             The Edit button opens the same modal window used in the main model design view, with one exception: instead of the regular Inputs field, it contains a "Possible Follows" setting. This defines which other layers are allowed to follow the currently edited layer during generation.

//             Lastly, the generator configuration includes the option to define the starting layer, i.e., the layer from which the generation process will begin.
//             <img src={generator_modal}></img>
//             After clicking the submit button the task will be sent to server.
//             <h2>Results</h2>
//             Once the model has been successfully created, it can be found on the "Models" page. Below, we present the result obtained from the previously described configuration.

//             As shown on the image below, the left section of the screen provides options to switch between other models the user has created. For the currently selected model, the user can either delete it or download it as a fully functional .keras file.
//             This file can be loaded and used directly within the Keras framework using its built-in load_model method.
//             You can also open various modals containing deails about the created model

//             <img src={models_page}></img>
//         </div>
//     )
// }

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
                    <li><strong>Automated Design</strong> – for users who prefer automatic architecture selection.</li>
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
                        Set a <strong>growth limit function</strong> to control how model complexity grows over time
                        (<code>none</code>, <code>linear</code>, <code>log</code>, <code>square</code>).
                    </li>
                    <li>Define an early stopping threshold.</li>
                    <li>
                        If using the Genetic Algorithm, extra fields appear: number of generations, population size, mutation rate, etc.
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
                    Clicking a layer opens a modal window to configure:
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
