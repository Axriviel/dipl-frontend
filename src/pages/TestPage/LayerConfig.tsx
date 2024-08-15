interface LayerParams {
  id: string;
  type: string;
  units?: number;
  activation?: string;
  inputs: string[];  // IDs of layers that serve as inputs to this layer
}

interface ModelParams {
  layers: LayerParams[];
}


export const LayerConfig: React.FC<{ 
  layer: LayerParams, 
  updateLayer: (layer: LayerParams) => void, 
  allLayers: LayerParams[]
}> = ({ layer, updateLayer, allLayers }) => {

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  updateLayer({ ...layer, [e.target.name]: e.target.value });
};

const handleInputsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
  updateLayer({ ...layer, inputs: selectedOptions });
};

return (
  <div>
    <label>Type: 
      <select name="type" value={layer.type} onChange={handleInputChange}>
        <option value="Dense">Dense</option>
        <option value="Conv2D">Conv2D</option>
        {/* Přidej další typy vrstev */}
      </select>
    </label>
    {layer.type === 'Dense' && (
      <>
        <label>Units: 
          <input type="number" name="units" value={layer.units || ''} onChange={handleInputChange} />
        </label>
        <label>Activation: 
          <select name="activation" value={layer.activation} onChange={handleInputChange}>
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            {/* Přidej další aktivační funkce */}
          </select>
        </label>
      </>
    )}

    {/* Select Inputs */}
    <label>Inputs: 
      <select multiple value={layer.inputs} onChange={handleInputsChange}>
        {allLayers.filter(l => l.id !== layer.id).map(l => (
          <option key={l.id} value={l.id}>{l.type} (ID: {l.id})</option>
        ))}
      </select>
    </label>
  </div>
);
};
