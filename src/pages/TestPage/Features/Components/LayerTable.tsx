import Tippy from "@tippyjs/react";
import React from "react";
import { Table, Button } from "react-bootstrap";
import { LayerParams } from "../../Models/LayerParams";

interface Props {
    layers: LayerParams[];
    handleLayerClick: (layer: any) => void;
    handleDelete: (id: string) => void;
}

export const LayerTable: React.FC<Props> = ({ layers, handleLayerClick, handleDelete }) => {
    return (
        <div className="layer-table">
            <Table striped bordered hover>
                <thead className="">
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>ID</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {layers.map((layer, index) => (
                        <tr key={layer.id}>
                            <td>{index + 1}</td>
                            <td>{layer.type}</td>
                            <td className="layer-id">
                                <Tippy content={layer.id}>
                                    <span>{layer.id}</span>
                                </Tippy>
                            </td>
                            <td className="text-center">
                                <Button variant="danger" className="mx-1" onClick={() => handleDelete(layer.id)}>
                                    Remove
                                </Button>
                                <Button variant="primary" className="mx-1" onClick={() => handleLayerClick(layer)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
