import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

interface CategoriesEditModalProps {
    onClose: (confirm: boolean) => void;
    category: {
        id: string;
        name: string;
    };
}

const CategoriesEditModal: React.FC<CategoriesEditModalProps> = ({ onClose, category }) => {
    const [categoryData, setCategoryData] = useState({ id: category.id, name: category.name });
    const [error, setError] = useState<string | null>(null);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);
    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false);

    // Function to update the category data via API call
    const updateCategory = async () => {
        setDisabledButton(true); // Disable buttons during API call
        setDisabledSubmitButton(true);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_ENDPOINT}category`,
                categoryData,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.status === 200) {
                onClose(true); // Close modal and optionally trigger fetchData()
            }
        } catch (error) {
            handleFetchError(error as AxiosError); // Handle API call errors
        } finally {
            setDisabledButton(false); // Re-enable buttons after API call
            setDisabledSubmitButton(false);
        }
    };

    // Function to validate form data
    const validator = () => {
        // Simple validation: disable submit button if name field is empty
        setDisabledSubmitButton(categoryData.name === '');
    };

    // Handle input change in the form fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCategoryData((prevValue) => ({ ...prevValue, [name]: value }));
    };

    // Handle API call errors
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

        validator(); // Re-validate form after handling error
    };

    // Handle retry button click
    const handleRetry = () => {
        setError(null); // Clear the error message
        setDisabledButton(false); // Enable form inputs for retry
        setDisabledSubmitButton(false);
    };

    // Effect to validate form on mount and whenever categoryData changes
    useEffect(() => {
        validator();
    }, [categoryData]);

    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {error ? (
                // Display error message and retry button if error state is not null
                <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                    {error}
                    <button onClick={handleRetry} className='ml-2 text-blue-500 hover:underline'>
                        Retry
                    </button>
                </div>
            ) : (
                // Display form inputs and buttons if there is no error
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>
                        Edit Product Category
                    </h3>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUtensils} />
                        <input
                            name='name'
                            type='text'
                            className='grow'
                            placeholder='Name'
                            defaultValue={categoryData.name}
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
                            onClick={updateCategory}
                            disabled={disabledSubmitButton || disabledButton} // Disable if either form is incomplete or retrying
                        >
                            {disabledButton ? 'Updating...' : 'Confirm'}{' '}
                            {/* Change button text during API call */}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoriesEditModal;
