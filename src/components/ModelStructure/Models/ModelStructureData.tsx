interface ILayer {
    layer_name: string;
    layer_type: string;
    num_params: number;
    neurons: number;
    trainable: boolean;
  }
  
 export interface IModelStructureData {
    model_name: string;
    layers: ILayer[];
  }