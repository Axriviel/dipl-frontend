export interface IModelSettingsGA {
    generations: number;          // Počet generací
    populationSize: number;       // Velikost populace
    numParents: number;           // Počet rodičů vybraných pro křížení
    mutationRate: number;         // Míra mutace (0–1)
    selectionMethod: string;      // Metoda výběru rodičů (např. Roulette, Tournament)
}