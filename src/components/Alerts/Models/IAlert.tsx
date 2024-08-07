export type AlertType = 'success' | 'danger' | 'info' | 'warning';

export interface IAlert {
    id: number;
    message: string;
    type: AlertType;
}