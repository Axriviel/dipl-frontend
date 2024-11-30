export interface IModel {
    id: number,
    name: string,
    accuracy: number,
    metric_value: number,
    watched_metric: string,
    metric_values_history: [{ epoch: number, value: number }],
    used_opt_method: string,
    error: number,
    dataset: string
}