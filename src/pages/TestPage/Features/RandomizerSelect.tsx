import { Form } from "react-bootstrap";

interface Props {
    value: string; // Aktuální hodnota randomizeru
    onChange: any; // Funkce volaná při změně hodnoty
    options: string[]; // Možnosti randomizeru
    label?: string; // Nepovinný popisek
}

export const RandomizerSelect: React.FC<Props> = ({
    value,
    onChange,
    options,
    label = 'Select Random Type' // Výchozí popisek
}) => {
    return (
        <Form.Group controlId="randomTypeSelect">
            <Form.Label>{label}</Form.Label>
            <Form.Select
                as="select"
                value={value}
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