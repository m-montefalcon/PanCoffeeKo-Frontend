import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';
interface CategoriesAddModalProps {
    onClose: (confirm: boolean) => void;
}
const CategoriesAddModal: React.FC<CategoriesAddModalProps> = ({ onClose }) => {
    const [categories, setCategories] = useState({
        name: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);
    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCategories((prevValue) => ({ ...prevValue, [name]: value }));
        console.log(`${name} ${value}`);
    };
    const validator = () => {
        if (categories.name !== '') {
            setDisabledSubmitButton(false); // Enable submit button if form is valid
        } else {
            setDisabledSubmitButton(true); // Disable submit button if form is incomplete
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
    const registerCategory = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}category`,
                categories,
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
            );
            if (response.status == 200) {
                onClose(true);
            }
        } catch (error) {
            handleFetchError(error as AxiosError);
        }
    };
    useEffect(() => {
        validator();
    }, [categories]);
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
                            value={categories.name}
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
                            onClick={registerCategory}
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

export default CategoriesAddModal;
