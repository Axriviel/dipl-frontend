export interface LayerParams {
  id: string;
  name: string;
  type: string;
  inputs: string[];
  [key: string]: any;
}