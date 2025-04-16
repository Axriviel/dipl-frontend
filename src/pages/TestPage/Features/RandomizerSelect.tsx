import { Form } from "react-bootstrap";
import { HelpfulTip } from "../../../features/Tooltip";

interface Props {
    value: string; 
    onChange: any; 
    options: string[]; 
    label?: string; 
}

export const RandomizerSelect: React.FC<Props> = ({
    value,
    onChange,
    options,
    label = 'Select Random Type' 
}) => {
    return (
        <Form.Group className="m-0">
            <Form.Label>{label} <HelpfulTip text="Select which randomization mode to use. Value means no randomization and using direct input value"/></Form.Label>
            <Form.Select
                as="select"
                value={value}
                className="w-50 mb-1"
                onChange={(e) => { 
                    console.log("Changing to:", e.target.value)
                    onChange(e.target.value)}}
            >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </Form.Select>
        </Form.Group >
    );
};