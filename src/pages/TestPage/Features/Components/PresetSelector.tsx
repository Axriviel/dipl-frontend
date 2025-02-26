import { Form } from "react-bootstrap"

interface Props {
    preset: string;
    handlePresetChange: (event: any) => void;
}

export const PresetSelector: React.FC<Props> = ({ preset, handlePresetChange }) => {
    return (
        <Form.Select
            className="cursor-pointer w-100"
            name="preset"
            value={preset}
            onChange={handlePresetChange}
        >
            <option key="Indians" value="Indians">Indians</option>
            <option key="Cifar10" value="Cifar10">Cifar10</option>
        </Form.Select>
    )
}