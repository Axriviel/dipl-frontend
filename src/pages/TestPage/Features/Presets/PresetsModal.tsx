import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { PresetSelector } from '../Components/PresetSelector';
import { IModelParams } from '../../Models/ModelParams';
import { LoadJsonModel } from '../Components/LoadJSONModel/LoadJSONModel';
import Tippy from '@tippyjs/react';
import { HelpfulTip } from '../../../../features/Tooltip';

interface PresetModalProps {
    show: boolean;
    handleClose: () => void;
    preset: string;
    handlePresetChange: (preset: string) => void;
    setModelParams: (params: IModelParams) => void;
    handleResetAll: () => void;
}

export const PresetsModal: React.FC<PresetModalProps> = ({ show, handleClose, preset, handlePresetChange, setModelParams, handleResetAll }) => {
    return (
        <Modal show={show} size='lg' onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Utility Configuration</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex flex-row flex-wrap justify-content-center'>
                    <LoadJsonModel setModelParams={setModelParams} />
                    <div className='d-flex justify-content-center flex-grow-1'><span className='util-border-left'></span></div>
                    <div className='d-flex flex-column align-items-center px-5'>
                        <Form.Label>Preset selection <HelpfulTip text='Loads selected preset into the designer' /></Form.Label>
                        <PresetSelector preset={preset} handlePresetChange={handlePresetChange} />
                        <Tippy content="Reset the whole page to the most basic setup possible">
                            <Button onClick={handleResetAll} className=' w-75 mt-2' variant="danger">Reset</Button>
                        </Tippy>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};