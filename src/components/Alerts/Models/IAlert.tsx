export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface IAlert {
    id: number;
    message: string;
    type: AlertType;
}