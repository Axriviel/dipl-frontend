export interface LayerParams {
    id: string;
    name: string;
    type: string;
    units?: number;
    unitsRandom:{
        type: string;
        min: number;
        max: number;
    };
    activation?: string;
    filters?: number;
    kernel_size?: number[];
    inputs: string[];
    [key: string]: any;
  }