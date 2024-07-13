import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';

interface CategoriesAddModalProps {
    onClose: (confirm: boolean) => void;
}

const CategoriesAddModal: React.FC<CategoriesAddModalProps> = ({ onClose }) => {
    const [name, setName] = useState(''); // State for category name
    const [error, setError] = useState<string | null>(null); // State for API error message
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [isFormValid, setIsFormValid] = useState(false); // State for form validation
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // State for disabling submit button

    // Handle input change for category name
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value); // Update category name state
    };

    // Function to handle API call errors and retry
    const handleFetchError = (error: AxiosError<any>) => {
        setIsLoading(false); // Disable loading indicator
        if (error.response) {
            const errorMessage = error.response.data.message || 'Unknown error occurred';
            setError(`Error ${error.response.status}: ${errorMessage}`); // Set error message
        } else if (error.request) {
            setError('No response from server. Please try again later.'); // No response from server
        } else {
            setError('Error fetching data. Please check your network connection.'); // Network error
        }
    };

    // Handler for retrying after an error
    const handleRetry = () => {
        setError(null); // Clear error message
        setIsSubmitDisabled(false); // Enable form inputs for retry
    };

    // Function to register new category
    const registerCategory = async () => {
        setIsLoading(true); // Enable loading indicator
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}category`,
                { name },
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
            );
            if (response.status === 200) {
                onClose(true); // Close modal on successful category creation
            }
        } catch (error) {
            handleFetchError(error as AxiosError); // Handle API call errors
        } finally {
            setIsLoading(false); // Always disable loading indicator after API call
        }
    };

    // Validate form whenever name changes
    useEffect(() => {
        setIsFormValid(!!name.trim()); // Check if name is not empty
    }, [name]);

    // JSX for rendering the add category modal
    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {error ? ( // Show error message and retry button if error occurred
                <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                    {error}
                    <button onClick={handleRetry} className='ml-2 text-blue-500 hover:underline'>
                        Retry
                    </button>
                </div>
            ) : (
                // Show form inputs and buttons if no error
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>
                        Add Product Category
                    </h3>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUtensils} />
                        <input
                            name='name'
                            type='text'
                            className='grow'
                            placeholder='Name'
                            value={name}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading} // Disable input during loading
                        />
                    </label>

                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose(false)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={isLoading} // Disable cancel button during loading
                        >
                            Cancel
                        </button>
                        <button
                            className='btn btn-success mt-2 rounded-md'
                            onClick={registerCategory}
                            disabled={isLoading || !isFormValid} // Disable submit button during loading or if form is invalid
                        >
                            {isLoading ? 'Adding...' : 'Confirm'}{' '}
                            {/* Change button text based on loading state */}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoriesAddModal;
