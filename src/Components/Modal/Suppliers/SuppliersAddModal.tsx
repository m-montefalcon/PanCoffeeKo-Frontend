import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faUser, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';

interface SuppliersAddModalProps {
    onClose: (confirm: boolean) => void;
}

interface SupplierDataForm {
    name: string;
    contact_number: string;
    supply_type: string;
}

const SuppliersAddModal: React.FC<SuppliersAddModalProps> = ({ onClose }) => {
    const [error, setError] = useState<string | null>(null); // State to manage error messages
    const [supplierForm, setSupplierForm] = useState<SupplierDataForm>({
        // State to manage form data
        name: '',
        contact_number: '',
        supply_type: '',
    });
    const [disabledButton, setDisabledButton] = useState<boolean>(false); // State to disable buttons during API calls
    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(true); // State to disable submit button until form is valid

    // Function to validate form fields
    const validator = () => {
        if (
            supplierForm.name !== '' &&
            supplierForm.contact_number.length === 11 &&
            supplierForm.supply_type !== ''
        ) {
            setDisabledSubmitButton(false); // Enable submit button if form is valid
        } else {
            setDisabledSubmitButton(true); // Disable submit button if form is incomplete
        }
    };

    // Handler for input changes in the form fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSupplierForm((prevData) => ({ ...prevData, [name]: value }));
    };

    // Function to send POST request to register supplier
    const registerSupplier = async () => {
        try {
            setDisabledButton(true); // Disable buttons during API call
            setDisabledSubmitButton(true); // Disable submit button during API call

            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}supplier`,
                supplierForm,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            );

            if (response.status === 200) {
                onClose(false); // Close modal on successful registration
            }
        } catch (error) {
            handleFetchError(error as AxiosError<any>); // Handle API call errors
        }
    };

    // Function to handle API call errors
    const handleFetchError = (error: AxiosError<any>) => {
        if (error.response) {
            const responseData = error.response.data;
            const errorMessage = responseData.message || 'Unknown error occurred';
            setError(`Error ${error.response.status}: ${errorMessage}`);
        } else if (error.request) {
            setError('No response from server. Please try again later.');
        } else {
            setError('Error fetching data. Please check your network connection.');
        }

        setDisabledButton(false); // Enable retry button and reset form for retry
        validator(); // Re-validate form after handling error
    };

    // Handler for retrying after an error
    const handleRetry = () => {
        setError(null); // Clear the error message
        setDisabledButton(false); // Enable form inputs for retry
    };

    // Effect to validate form on form data change
    useEffect(() => {
        validator();
    }, [supplierForm]);

    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {error ? (
                // Display error message and retry button
                <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                    {error}
                    <button onClick={handleRetry} className='ml-2 text-blue-500 hover:underline'>
                        Retry
                    </button>
                </div>
            ) : (
                // Display form inputs and buttons
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>Add User</h3>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUser} />
                        <input
                            name='name'
                            type='text'
                            className='grow'
                            placeholder='Name'
                            value={supplierForm.name}
                            onChange={handleInputChange}
                            required
                            disabled={disabledButton}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faAddressBook} />
                        <input
                            name='contact_number'
                            type='tel'
                            className='grow'
                            placeholder='Contact Number'
                            value={supplierForm.contact_number}
                            maxLength={11}
                            onChange={handleInputChange}
                            required
                            disabled={disabledButton}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faTruck} />
                        <input
                            name='supply_type'
                            type='text'
                            className='grow'
                            placeholder='Supply Type'
                            value={supplierForm.supply_type}
                            onChange={handleInputChange}
                            required
                            disabled={disabledButton}
                        />
                    </label>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose(false)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={disabledButton}
                        >
                            Cancel
                        </button>
                        <button
                            className='btn btn-success mt-2 rounded-md'
                            onClick={registerSupplier}
                            disabled={disabledSubmitButton || disabledButton} // Disable if either form is incomplete or retrying
                        >
                            Confirm
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SuppliersAddModal;
