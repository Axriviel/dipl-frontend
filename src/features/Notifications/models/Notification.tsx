export interface INotification {
    id: number;
    message: string;
    timestamp: string;
    was_read: boolean;
    user: string;  // nebo jiný vhodný typ podle toho, co vrací server
}
