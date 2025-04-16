import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    value: string; // starting val
    onChange: (value: string) => void; 
    disabled?: boolean; 
    className?: string; 
}

export const DebouncedTextArea: React.FC<Props> = ({
    value,
    onChange,
    disabled = false,
    className = '',
}) => {
    const [inputValue, setInputValue] = useState(value); 
    const [isInitialRender, setIsInitialRender] = useState(true); // is first render

    // Debouncing useEffect
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false); // was first render
            return; // do not trigger effect on first render
        }

        const timer = setTimeout(() => {
            onChange(inputValue); // delay before onChange trigger
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    return (
        <Form.Control
            as="textarea"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)} 
            disabled={disabled}
            className={className}
        />
    );
};
