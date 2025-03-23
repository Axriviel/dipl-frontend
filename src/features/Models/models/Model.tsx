import { ITaskProtocol } from "./TaskProtocol";

export interface IModel {
    id: number,
    name: string,
    metric_value: number,
    watched_metric: string,
    metric_values_history: [{ epoch: number, value: number }],
    used_opt_method: string,
    dataset: string,
    used_designer: string,
    task_protocol: ITaskProtocol
    used_tags: {user_tags:string[]}
}