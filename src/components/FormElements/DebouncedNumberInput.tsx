import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

interface Props {
    value: number; // Hodnota vstupu
    onChange: (value: number) => void; // Callback při změně
    timeout?: number; // Čas debounce (defaultně 300 ms)
    placeholder?: string; // Placeholder pro vstupní pole
    min?: number; // Minimální hodnota
    max?: number; // Maximální hodnota
    step?: number; // Krok pro vstup
}

export const DebouncedNumberInput: React.FC<Props> = ({
    value,
    onChange,
    timeout = 300,
    placeholder,
    min,
    max,
    step,
}) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());
    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return;
        }

        const timer = setTimeout(() => {
            const parsedValue = Number(inputValue);
            if (!isNaN(parsedValue) && (min === undefined || parsedValue >= min) && (max === undefined || parsedValue <= max)) {
                onChange(parsedValue);
            }
        }, timeout);

        return () => clearTimeout(timer);
    }, [inputValue]);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    return (
        <Form.Control
            type="number"
            value={inputValue}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        />
    );
};
