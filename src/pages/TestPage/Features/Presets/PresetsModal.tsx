import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PresetSelector } from '../Components/PresetSelector';
import { IModelParams } from '../../Models/ModelParams';
import { LoadJsonModel } from '../Components/LoadJSONModel/LoadJSONModel';

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
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Preset Configuration</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <LoadJsonModel setModelParams={setModelParams} />

                <PresetSelector preset={preset} handlePresetChange={handlePresetChange} />
                <Button onClick={handleResetAll} className='mx-2' variant="danger">Reset</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};