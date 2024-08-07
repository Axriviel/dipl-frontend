import React from 'react';
import { Alert } from './Alert';
import "./Alerts.css";
import { IAlert } from './Models/IAlert';
import { useAlert } from './AlertContext';

export const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="alerts-container">
      {alerts.map((alert: IAlert) => (
        <Alert
          key={alert.id}
          alert={alert}
          removeAlert={removeAlert}
        />
      ))}
    </div>
  );
};