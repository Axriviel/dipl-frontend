import { IModelSettings } from "../../TestPage/Models/ModelSettings";

export interface IModelAutoSettings extends Omit<IModelSettings, "NNI"> {
    NNI?: undefined
}