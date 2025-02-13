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
                const baseKey = key.replace("Random", ""); // Např. sizeRandom → size
                console.log(baseKey);
                console.log(updatedLayer);
                console.log("obj_val", Object.values(layers_params));

                updatedLayer[baseKey] = Object.values(layers_params)[i]; // Nahradíme hodnotu
                console.log(updatedLayer[baseKey]);

                i++; // Zvyšení i funguje správně

                console.log("i" + i);

                delete updatedLayer[key]; // Odstraníme původní `Random` klíč
            }
        }

        console.log("testst", updatedLayer)
        return updatedLayer;
    });
};


const replaceGeneratorWithLayers = (i: number, generatorConf: any, prevId: string) => {
    // console.log("JSem tady")
    const relevantConf = generatorConf[i]
    const usedParams = relevantConf["used_parameters"]
    const layerSequence = relevantConf["layers_sequence"]
    const usedLayers = relevantConf["used_layers"]
    // console.log("Gen conf: " + i + JSON.stringify(relevantConf))
    // console.log("Gen conf params: " + i + JSON.stringify(usedParams))
    // console.log("Gen Lazer seq: " + i + JSON.stringify(layerSequence))
    // console.log("Gen used laz: " + i + JSON.stringify(usedLayers))

    var genLayers: any[] = []
    var prevId = prevId;


    layerSequence.forEach((layer: any) => {
        // console.log("layer " + layer)
        // console.log("usl ", usedLayers)
        var layer1 = { ...usedLayers.find((l: any) => l.id === layer) };
        console.log("l1 ", layer1);
        layer1.id = crypto.randomUUID();
        layer1.inputs = [prevId]
        prevId = layer1.id
        genLayers.push(layer1)
    });
    // console.log("gen layers", genLayers)
    // console.log("used_parmas", usedParams)
    const mergedDict = usedParams.reduce((acc: any, obj: any, index: any) => {
        const key = Object.keys(obj)[0]; // První (a jediný) klíč v objektu
        acc[`${key}_${index + 1}`] = obj[key]; // Přidáme index k názvu klíče
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

    var lastGeneratorIndex
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target?.result as string);

            if (!jsonData.creation_config || !Array.isArray(jsonData.creation_config)) {
                console.error("Invalid JSON structure: Missing creation_config");
                return;
            }

            const [l, settings, datasetConfig] = jsonData.creation_config;

            const [layers_params, t, generator_conf] = jsonData.used_params;

            console.log(Object.values(layers_params)[0])
            console.log("original lp", layers_params)
            var layers: LayerParams[] = replaceRandomValues(l, layers_params);
            const layersFinal: LayerParams[] = [];

            var lastGeneratorId: null | string = null;
            var i = 0;

            layers.forEach((layer, index) => {
                console.log("layer: ", layer.type, index);

                // Pokud existuje ID z posledního generátoru, nastavíme ho jako vstup
                if (lastGeneratorId) {
                    console.log(layer)
                    console.log("settings", layer.inputs)
                    layer.inputs = [lastGeneratorId];
                    console.log("after set", layer.inputs)
                    lastGeneratorId = null;
                }

                if (layer.type.toLowerCase() === "generator") {
                    lastGeneratorIndex = (layer: any) => layers.findIndex(l => l.id === layer.id);
                    console.log("lgi", lastGeneratorId)
                    // Přidáme do layersFinal vrstvy před generátorem
                    // layersFinal.push(...layers.slice(layersFinal.length, index));

                    const prevId = layersFinal.length > 0 ? layersFinal[layersFinal.length - 1].id : null;
                    console.log("Prev ID:", prevId);

                    // Nahrazení generátoru vrstvami
                    const generatedLayers = replaceGeneratorWithLayers(i, generator_conf, prevId!);
                    console.log("genl", generatedLayers)
                    layersFinal.push(...generatedLayers);

                    lastGeneratorId = generatedLayers[generatedLayers.length - 1].id;
                    console.log("last id", lastGeneratorId)
                    i++;
                }
                else {
                    layersFinal.push(layer)
                }
            });
            console.log("before push", layers)
            // Přidání zbývajících vrstev za posledním generátorem
            // if (lastGeneratorIndex !== -1) {
            //     layersFinal.push(...layers.slice(lastGeneratorIndex));
            // } 
            console.log("lfinal", layersFinal)
            layers = layersFinal;




            // var layers: LayerParams[] = replaceRandomValues(l, layers_params);

            // const layersFinal = []

            // //potřebuju ještě získat to finální pole

            // // console.log(generator_conf)
            // var lastGeneratorId: null | string = null
            // var i = 0
            // layers.forEach((layer, index) => {
            //     console.log(layer.type, index)
            //     if (lastGeneratorId) {
            //         layer.inputs = [lastGeneratorId]
            //         lastGeneratorId = null
            //     }
            //     if (layer.type.toLowerCase() === "generator") {
            //         const tempLayers = layers.slice(0, index)
            //         const prevId = Number(tempLayers[tempLayers.length - 1].id)
            //         console.log("rev id" + prevId)
            //         const generater_layer = replaceGeneratorWithLayers(i, generator_conf, prevId)
            //         console.log("genl", generater_layer)
            //         lastGeneratorId = generater_layer[generater_layer.length - 1].id
            //         i++
            //     }
            // })
            // layers = layersFinal








            //tady teď přidat další zpracování - volání fce na replace generátoru vrstvami a na to ještě pak znovu replaceRandomValues

            // const layers = replaceGeneratorWithLayers(parsedLayers, generator_conf)

            // Předání hodnot přímo do setModelParams
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