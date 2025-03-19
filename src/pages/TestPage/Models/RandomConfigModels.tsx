//upravit aktualizaci a použít podobný přístup - udělat více interface pro ostatní možnosti a pokusit se to přendat do modálu?
// Definice struktur pro náhodnost
export interface IRandomConfigBase {
  type: 'numeric' | 'text' | "numeric-test";
}

export interface INumericRandomConfig extends IRandomConfigBase {
  type: 'numeric';
  min: number;
  max: number;
  step?: number; // Volitelný parametr
}

export interface ITestNumericRandomConfig extends IRandomConfigBase {
  type: "numeric-test";
  min: number;
  max: number;
}


export interface ITextRandomConfig extends IRandomConfigBase {
  type: 'text';
  options: string[];
}

export type RandomConfig = INumericRandomConfig | ITextRandomConfig | ITestNumericRandomConfig;
export const NumericRandomizers = ["value", "numeric", "numeric-test"];
export const TextRandomizers = ["value", "text"];