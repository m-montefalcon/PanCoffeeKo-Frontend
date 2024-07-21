import React from 'react';

interface OptionData {
    id: string;
    name: string;
}

interface SelectComponentProps {
    name: string;
    value: string;
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    data: OptionData[];
}

const SelectComponent: React.FC<SelectComponentProps> = ({
    name,
    value,
    placeholder,
    onChange,
    required,
    disabled,
    className = '',
    data,
}) => {
    return (
        <select
            className={`m-2 select w-80 ${className}`}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
        >
            {!data || data.length === 0 ? (
                <option value='' disabled>
                    No {placeholder} available
                </option>
            ) : (
                <>
                    <option value='' disabled>
                        Select {placeholder}
                    </option>
                    {data.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </>
            )}
        </select>
    );
};

export default SelectComponent;
