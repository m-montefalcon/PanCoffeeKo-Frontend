import React from 'react';

interface InputComponentProps {
    name: string;
    type: 'text' | 'file' | 'number'; // Specify 'text', 'file', or 'number'
    placeholder: string;
    value: string | number | File;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
    ) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    min?: string;
    step?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
    name,
    type,
    placeholder,
    value,
    onChange,
    className,
    required,
    disabled,
    min,
    step,
}) => {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (onChange) {
            onChange(event);
        }
    };

    if (type === 'file') {
        return (
            <div className='file-input-container'>
                <label className='file-input-label'>
                    <span className='file-input-text'>{placeholder}</span>
                    <input
                        type='file'
                        name={name}
                        className={`file-input ${className}`} // Use className if provided
                        onChange={handleChange} // Render onChange only if provided
                        required={required} // Render required only if provided
                        disabled={disabled} // Render disabled only if provided
                    />
                </label>
            </div>
        );
    }

    // Default to text or number input
    return (
        <input
            type={type}
            name={name}
            className={className} // Use className if provided
            placeholder={placeholder}
            value={value as string} // Cast value to string for text input
            onChange={handleChange} // Render onChange only if provided
            required={required} // Render required only if provided
            disabled={disabled} // Render disabled only if provided
            min={min}
            step={step}
        />
    );
};

export default InputComponent;
