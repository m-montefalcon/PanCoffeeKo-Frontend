import axios, { AxiosError } from 'axios';
import { useState } from 'react';

interface CategoriesDeleteModalProps {
    onClose: (confirm: boolean) => void;
    category: {
        id: string;
        name: string;
    };
}

const CategoriesDeleteModal: React.FC<CategoriesDeleteModalProps> = ({ onClose, category }) => {
    const [disabledButton, setDisabledButton] = useState<boolean>(false); // State to disable buttons during API call
    const [error, setError] = useState<string | null>(null); // State to handle error messages

    const softDeleteCategory = async () => {
        setDisabledButton(true); // Disable buttons to prevent multiple submissions
        setError(null); // Reset error state on each button click

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_ENDPOINT}category/${category.id}`,
            );
            if (response.status === 200) {
                onClose(true); // Close modal on successful deletion
            }
        } catch (error) {
            handleFetchError(error as AxiosError); // Handle API call errors
        } finally {
            setDisabledButton(false); // Always re-enable buttons after API call (whether success or failure)
        }
    };

    const handleFetchError = (error: AxiosError<any>) => {
        if (error.response) {
            const responseData = error.response.data;
            const errorMessage = responseData.message || 'Unknown error occurred';
            setError(`Error ${error.response.status}: ${errorMessage}`);
        } else if (error.request) {
            setError('No response from server. Please try again later.');
        } else {
            setError('Error deleting data. Please check your network connection.');
        }
    };

    const handleRetry = () => {
        setError(null); // Clear error message
        setDisabledButton(false); // Enable buttons for retry
    };

    return (
        <div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-base-200 bg-opacity-50'>
            {/* Backdrop to cover entire screen */}

            {/* Display error message and retry button */}

            <div className='bg-base-200 rounded-lg p-6 z-50'>
                {error ? (
                    <div className='text-red-600 text-lg mt-4'>
                        {error}
                        <button
                            onClick={handleRetry}
                            className='ml-2 text-blue-500 hover:underline'
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Modal content */}
                        <h3 className='font-bold text-lg mb-4'>Delete Product Category</h3>
                        <p className='mb-4'>{`Are you sure you want to delete ${category.name} as a product category?`}</p>
                        {/* Modal actions */}
                        <div className='flex justify-end'>
                            <button
                                className='btn mr-2'
                                onClick={() => onClose(false)}
                                disabled={disabledButton}
                            >
                                Cancel
                            </button>
                            <button
                                className='btn btn-outline btn-error'
                                disabled={disabledButton}
                                onClick={softDeleteCategory}
                            >
                                {disabledButton ? 'Deleting...' : 'Delete'}{' '}
                                {/* Change button text during API call */}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoriesDeleteModal;
