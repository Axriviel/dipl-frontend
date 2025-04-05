export interface IDatasetConfig {
    x_columns: string[];       // Array sloupců pro vstupy (X)
    x_num: number;
    y_columns: string[];
    one_hot_x_columns: string[];
    one_hot_y_columns: string[];
    encode_y?: boolean;
    y_num: number;          // Název sloupce pro výstup (Y)
    test_size: number;         // Velikost testovací sady
    // file?: File | null;        // Soubor datasetu
  }