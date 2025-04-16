import { LayerParams } from "../../../Models/LayerParams";
import { IModelParams } from "../../../Models/ModelParams";

//used to parse JSON and replace random values for the used parameter one
const replaceRandomValues = (layers: any[], layers_params: any) => {
    let i = 0;
    return layers.map(layer => {
        let updatedLayer = { ...layer };
        console.log(updatedLayer)
        for (const key of Object.keys(updatedLayer)) {
            if (key.includes("Random")) {
                const baseKey = key.replace("Random", ""); // e.g. sizeRandom → size
                console.log(baseKey);
                console.log(updatedLayer);
                console.log("obj_val", Object.values(layers_params));

                updatedLayer[baseKey] = Object.values(layers_params)[i]; // replace with value
                console.log(updatedLayer[baseKey]);

                i++;

                console.log("i" + i);

                delete updatedLayer[key];
            }
        }

        console.log("testst", updatedLayer)
        return updatedLayer;
    });
};


const replaceGeneratorWithLayers = (i: number, generatorConf: any, prevId: string) => {
    const relevantConf = generatorConf[i]
    const usedParams = relevantConf["used_parameters"]
    const layerSequence = relevantConf["layers_sequence"]
    const usedLayers = relevantConf["used_layers"]

    var genLayers: any[] = []
    var prevId = prevId;


    layerSequence.forEach((layer: any) => {
        var layer1 = { ...usedLayers.find((l: any) => l.id === layer) };
        console.log("l1 ", layer1);
        layer1.id = crypto.randomUUID();
        layer1.inputs = [prevId]
        prevId = layer1.id
        genLayers.push(layer1)
    });
    const mergedDict = usedParams.reduce((acc: any, obj: any, index: any) => {
        const key = Object.keys(obj)[0];
        acc[`${key}_${index + 1}`] = obj[key];
        return acc;
    }, {});
    console.log("merged dict:", mergedDict)

    const test = replaceRandomValues(genLayers, mergedDict)
    console.log("with replacement", test)
    return test

}


export const loadWithReplace = (file: File,
    setModelParams: (params: IModelParams) => void
) => {

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target?.result as string);

            if (!jsonData.creation_config || !Array.isArray(jsonData.creation_config)) {
                console.error("Invalid JSON structure: Missing creation_config");
                return;
            }

            const [l, settings, datasetConfig] = jsonData.creation_config;

            const [layers_params, _t, generator_conf] = jsonData.used_params;

            console.log(Object.values(layers_params)[0])
            // console.log("original lp", layers_params)
            var layers: LayerParams[] = replaceRandomValues(l, layers_params);
            const layersFinal: LayerParams[] = [];

            var lastGeneratorId: null | string = null;
            var i = 0;

            layers.forEach((layer, index) => {
                console.log("layer: ", layer.type, index);

                // use id from last generator as input
                if (lastGeneratorId) {
                    // console.log(layer)
                    // console.log("settings", layer.inputs)
                    layer.inputs = [lastGeneratorId];
                    // console.log("after set", layer.inputs)
                    lastGeneratorId = null;
                }

                if (layer.type.toLowerCase() === "generator") {
                    const prevId = layersFinal.length > 0 ? layersFinal[layersFinal.length - 1].id : null;

                    const generatedLayers = replaceGeneratorWithLayers(i, generator_conf, prevId!);
                    layersFinal.push(...generatedLayers);

                    lastGeneratorId = generatedLayers[generatedLayers.length - 1].id;
                    i++;
                }
                else {
                    layersFinal.push(layer)
                }
            });
            layers = layersFinal;

            setModelParams({
                layers,
                settings,
                datasetConfig
            });

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };

    reader.readAsText(file);
};