import React, { useState } from 'react';
import { useAlert } from '../../components/Alerts/AlertContext';
import { ModelComponentSelector } from '../../features/ModelDesigner/ModelComponentSelector';
import { configData } from '../../config/config';

export const ModelDesignerPage: React.FC = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        test: "tady jsou random data",
    });

    const { addAlert } = useAlert();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${configData.API_URL}/api/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            addAlert('Data sent successfully!', 'success'); // Úspěšná notifikace
            console.log(result);
        } catch (error) {
            addAlert('Failed to send data.', 'error'); // Chybová notifikace
            console.error('Error:', error);
        }
    };

    return (
        <div className='d-flex'>
            <div className='flex-grow-1 m-2'>
                <h2>Tady je testovací stránka</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={data.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="text" name="email" value={data.email} onChange={handleChange} />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className='m-2'>
                <ModelComponentSelector />
            </div>
        </div>
    );
};
