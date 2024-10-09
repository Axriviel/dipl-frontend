import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    value: string; // Počáteční hodnota
    onChange: (value: string) => void; // Funkce, která se zavolá po debouncingu
    disabled?: boolean; // Nepovinný parametr pro zakázání vstupu
    className?: string; // Nepovinná třída pro stylování
}

export const DebouncedTextArea: React.FC<Props> = ({
    value,
    onChange,
    disabled = false,
    className = '',
}) => {
    const [inputValue, setInputValue] = useState(value); // Dočasná hodnota pro textarea
    const [isInitialRender, setIsInitialRender] = useState(true); // Sledování prvního renderu

    // Debouncing useEffect
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false); // Nastavíme, že první render proběhl
            return; // Přerušíme efekt při prvním renderu
        }

        const timer = setTimeout(() => {
            onChange(inputValue); // Zavoláme onChange až po 300 ms neaktivity
        }, 300);

        // Zrušíme timeout při každé změně inputu, dokud uživatel nepřestane psát
        return () => clearTimeout(timer);
    }, [inputValue]);

    return (
        <Form.Control
            as="textarea"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)} // Lokální změna inputu
            disabled={disabled}
            className={className}
        />
    );
};
