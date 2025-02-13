import { IModelSettings } from "../../TestPage/Models/ModelSettings";
import { IModelSettingsNNI } from "../../TestPage/Models/ModelSettingsNNI";

export interface IModelAutoSettings extends Omit<IModelSettings, "NNI"> {
    NNI?: IModelSettingsNNI
}