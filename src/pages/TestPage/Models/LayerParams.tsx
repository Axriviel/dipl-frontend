import { RandomConfig } from "../LayerConfig";

export interface LayerParams {
    id: string;
    name: string;
    type: string;
    units?: number;
    unitsRandom?: RandomConfig;
    activation?: string;
    filters?: number;
    kernel_size?: number[];
    inputs: string[];
    [key: string]: any;
  }