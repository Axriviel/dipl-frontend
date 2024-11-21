export interface IModelSettingsNNI {
    nni_max_trials: number;       // Maximální počet trialů
    nni_concurrency: number;      // Počet současně běžících trialů
    nni_tuner: string;            // Použitý tuner v NNI
}