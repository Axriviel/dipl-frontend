export interface ITaskProtocol {
    x_columns: string[],
    y_columns: string[],
    one_hot_encoded_x: string[],
    one_hot_encoded_y: string[],
    started_at: string,
    finished_at: string,
    stopped_by?: string,
    limit_growth: string,
    epochs: any
}