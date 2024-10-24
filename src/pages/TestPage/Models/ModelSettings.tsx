export interface IModelSettings{
    opt_algorithm: string,
    optimizer: string,
    loss: string,
    metrics: string[],
    epochs: number,
    batch_size: number,
}