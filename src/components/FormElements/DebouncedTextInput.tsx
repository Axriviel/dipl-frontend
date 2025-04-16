import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    value: string;
    timeout?: number;
    onChange: (value: string) => void;
}

// default timeout 300 ms
export const DebouncedTextInput: React.FC<Props> = ({ value, onChange, timeout = 300 }) => {
    const [inputValue, setInputValue] = useState(value);
    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return;

        } const timer = setTimeout(() => {
            onChange(inputValue);
        }, timeout);

        return () => clearTimeout(timer);
    }, [inputValue]);

    return (
        <Form.Control
            type="text"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} 
        />
    );
};
