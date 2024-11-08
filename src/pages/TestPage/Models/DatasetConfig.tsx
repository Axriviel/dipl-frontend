export interface IDatasetConfig {
    x_columns: string[];       // Array sloupců pro vstupy (X)
    x_num: number;
    y_column: string;
    y_num: number;          // Název sloupce pro výstup (Y)
    test_size: number;         // Velikost testovací sady
    // file?: File | null;        // Soubor datasetu
  }