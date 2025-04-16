import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CustomizableDesign } from '../../components/DesignerOptions/CustomizableDesign';
import { FullAutoDesign } from '../../components/DesignerOptions/FullAutoDesign';
import "./ModelDesignerPage.css";
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

export const ModelDesignerPage: React.FC = () => {
    const [selectedDesigner, handleSelectDesigner] = useState(false)
    const [chosenDesigner, handleDesignerChosen] = useState(false)

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

    return (
        <div>
            {chosenDesigner === false ?
                <div>
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

                    <div className='d-flex justify-content-center'>Usage example page:<span className='mx-1 cursor-pointer' onClick={handleNavigateToUsageExample}>HERE</span> </div>
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
        </div>
    );
};
