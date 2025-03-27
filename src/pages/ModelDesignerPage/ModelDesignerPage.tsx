import React, { useState } from 'react';
//import { ModelComponentSelector } from '../../features/ModelDesigner/ModelComponentSelector';
//import { configData } from '../../config/config';
import { Button } from 'react-bootstrap';
import { CustomizableDesign } from '../../components/DesignerOptions/CustomizableDesign';
import { FullAutoDesign } from '../../components/DesignerOptions/FullAutoDesign';
import "./ModelDesignerPage.css";
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

export const ModelDesignerPage: React.FC = () => {
    const [selectedDesigner, handleSelectDesigner] = useState(false)
    const [chosenDesigner, handleDesignerChosen] = useState(false)

    // const [data, setData] = useState({
    //     name: '',
    //     email: '',
    //     test: "tady jsou random data",
    // });

    // const { addAlert } = useAlert();

    const handleDesignerChange = () => {
        handleSelectDesigner(!selectedDesigner)
    }

    const handleSelectCustomized = () => {
        handleDesignerChosen(true)
        handleSelectDesigner(false)

    }

    const handleSelectFullAuto = () => {
        handleDesignerChosen(true)
        handleSelectDesigner(true)
    }
    const navigate = useNavigate();
    const handleNavigateToUsageExample = () => {
        navigate("/usageexample")

    }

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setData({
    //         ...data,
    //         [e.target.name]: e.target.value
    //     });
    // };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch(`${configData.API_URL}/api/data`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(data)
    //         });

    //         const result = await response.json();
    //         addAlert('Data sent successfully!', 'success'); // Úspěšná notifikace
    //         console.log(result);
    //     } catch (error) {
    //         addAlert('Failed to send data.', 'error'); // Chybová notifikace
    //         console.error('Error:', error);
    //     }
    // };

    return (
        <div>
            {chosenDesigner === false ?
                <div className='d-flex flex-column align-items-center p-3 my-5 basic-card'>
                    <h2 className='bordered-down'>Choose the designer</h2>
                    <div className='mt-1 m-3 d-flex flex-row justify-content-center'>
                        <Tippy content="Designer allowing manual addition of layers, choice of architecture etc.">
                            <Button className='mx-3' onClick={handleSelectCustomized}>Custom</Button>
                        </Tippy>
                        <Tippy content="Designer that allows automated model creation">
                            <Button className='mx-3' onClick={handleSelectFullAuto}>Automated</Button>
                        </Tippy>
                    </div>
                </div>
                :
                <>
                    <Tippy content="Switch to other designer" placement='bottom'>
                        <Button className='switch-button' onClick={handleDesignerChange}>Flip</Button>
                    </Tippy>

                    {selectedDesigner !== false ?
                        <FullAutoDesign /> :
                        <CustomizableDesign />
                    }
                </>
            }

            <div className='d-flex justify-content-center'>Usage example page:<span className='mx-1 cursor-pointer' onClick={handleNavigateToUsageExample}>HERE</span> </div>
        </div>

        /*
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
        */
    );
};
