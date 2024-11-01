export interface IModel {
    id: number,
    name: string,
    accuracy: number,
    metric_value: number,
    watched_metric: string,
    metric_values_history: [{ epoch: number, value: number }],
    error: number,
    dataset: string
}