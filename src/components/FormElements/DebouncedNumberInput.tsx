import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

interface Props {
    value: number; 
    onChange: (value: number) => void; 
    timeout?: number; 
    placeholder?: string; 
    min?: number; 
    max?: number; 
    step?: number;
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
