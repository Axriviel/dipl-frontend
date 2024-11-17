import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    value: string;
    timeout?: number;
    onChange: (value: string) => void;
}

// default timeout 300 ms
export const DebouncedTextInput: React.FC<Props> = ({ value, onChange, timeout = 300 }) => {
    const [inputValue, setInputValue] = useState(value); // Dočasná hodnota pro input
    const [isInitialRender, setIsInitialRender] = useState(true); // Stav pro sledování prvního renderu

    // Uložíme změny až po určité době neaktivity
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false); // Nastavíme, že první render proběhl
            return; // Přerušíme efekt při prvním renderu

        } const timer = setTimeout(() => {
            onChange(inputValue); // Zavoláme onChange až po 300 ms neaktivity
        }, timeout);

        // Zrušíme timeout při každé změně inputu, dokud uživatel nepřestane psát
        return () => clearTimeout(timer);
    }, [inputValue]);

    return (
        <Form.Control
            type="text"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} // Lokální změna inputu
        />
    );
};
