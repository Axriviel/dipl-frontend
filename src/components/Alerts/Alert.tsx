import { IAlert } from './Models/IAlert';
import "./Alerts.css";

interface Props {
    alert: IAlert,
    removeAlert: (id: number) => void;
}

export const Alert = ({ alert, removeAlert }: Props) => {

    return (
        <div key={alert.id} className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message + alert.id}
            <button type="button" className="btn-close" onClick={() => removeAlert(alert.id)}></button>
        </div>
    );
};