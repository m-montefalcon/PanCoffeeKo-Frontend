import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAddressBook, faTruck } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';

interface SuppliersEditModalProps {
    onClose: (confirm: boolean) => void;
    supplier: {
        id: string;
        name: string;
        contact_number: string;
        supply_type: string;
    };
}

const SuppliersEditModal: React.FC<SuppliersEditModalProps> = ({ onClose, supplier }) => {
    const [supplierData, setSupplierData] = useState({
        id: supplier.id,
        name: supplier.name,
        contact_number: supplier.contact_number,
        supply_type: supplier.supply_type,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);

    const handleConfirm = async () => {
        setDisabledButton(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_ENDPOINT}supplier`,
                supplierData,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.status === 200) {
                setDisabledButton(false);
                onClose(true);
            }
        } catch (error) {
            handleFetchError(error as AxiosError<any>);
        }
    };

    const handleFetchError = (error: AxiosError<any>) => {
        setLoading(false);
        if (error.response) {
            const responseData = error.response.data;
            const errorMessage = responseData.message || 'Unknown error occurred';
            setError(`Error ${error.response.status}: ${errorMessage}`);
        } else if (error.request) {
            setError('No response from server. Please try again later.');
        } else {
            setError('Error fetching data. Please check your network connection.');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSupplierData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const clearError = () => {
        setDisabledButton(false);
        setError(null);
    };

    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {loading ? (
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>Edit User</h3>
                    <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose(true)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={disabledButton}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : error ? (
                <>
                    <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                        {error}
                        <button onClick={clearError} className='ml-2 text-blue-500 hover:underline'>
                            Retry
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>Edit User</h3>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUser} />
                        <input
                            name='name'
                            type='text'
                            className='grow'
                            placeholder='Name'
                            value={supplierData.name}
                            onChange={handleChange}
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
                            value={supplierData.contact_number}
                            maxLength={11}
                            onChange={handleChange}
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
                            value={supplierData.supply_type}
                            onChange={handleChange}
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
                            disabled={disabledButton}
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SuppliersEditModal;
