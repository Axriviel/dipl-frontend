export interface IDatasetConfig {
    x_columns: string[];       
    x_num: number;
    y_columns: string[];
    one_hot_x_columns: string[];
    one_hot_y_columns: string[];
    encode_y?: boolean;
    y_num: number;          
    test_size: number;         
  }