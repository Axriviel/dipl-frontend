import React from "react";
import { IFlattenLayer } from "../../Models/FlattenLayer";

interface Props {
    currentLayer: IFlattenLayer;
    handleChange: (key: string, value: any) => void;
    InputsConst: JSX.Element;
}

export const FlattenLayerForm: React.FC<Props> = ({ InputsConst }) => (
    <>
    {InputsConst}
    </>
);
