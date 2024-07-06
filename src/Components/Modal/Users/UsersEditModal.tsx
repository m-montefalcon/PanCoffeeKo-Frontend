import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faUser, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';

type UsersModalProps = {
    onClose: (userId: string, confirmed: boolean) => void;
    selectedUserId: string;
};

interface UserFullDetail {
    userId: string;
    name: string;
    email: string;
    contact_number: string;
    image_url?: string;
    isEmployed: boolean;
    role: string;
    created_at: string;
    updated_at: string;
}

const UsersModal: React.FC<UsersModalProps> = ({ onClose, selectedUserId }) => {
    const [user, setUser] = useState<UserFullDetail>({
        userId: '',
        name: '',
        email: '',
        contact_number: '',
        image_url: '',
        isEmployed: true,
        role: '',
        created_at: '',
        updated_at: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(user.isEmployed);

    const fetchData = async () => {
        try {
            const response = await axios.get<{ data: UserFullDetail }>(
                `${import.meta.env.VITE_API_ENDPOINT}users/${selectedUserId}`,
            );
            setUser(response.data.data);
            setLoading(false);
        } catch (error) {
            handleFetchError(error as AxiosError<any>);
        }
    };

    const updateData = async () => {
        try {
            setDisabledButton(true);
            const updatedUser = { ...user, userId: selectedUserId };
            const response = await axios.put(
                `${import.meta.env.VITE_API_ENDPOINT}user`,
                updatedUser,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            );
            if (response.status === 200) {
                onClose('', true);
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        if (type === 'checkbox') {
            handleToggle();
        } else {
            setUser((prevUser) => ({
                ...prevUser,
                [name]: value,
            }));
        }
    };

    const handleToggle = () => {
        const newIsChecked = !isChecked;
        setIsChecked(newIsChecked);
        setUser((prevUser) => ({
            ...prevUser,
            isEmployed: newIsChecked,
        }));
    };

    const clearError = () => {
        setLoading(true);
        setError(null);
        fetchData();
        setDisabledButton(false); // Should be false to enable buttons again after clearing error
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {loading ? (
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>Edit User</h3>
                    <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose('', false)}
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
                            value={user.name}
                            onChange={handleInputChange}
                            disabled={disabledButton}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            name='email'
                            type='text'
                            className='grow'
                            placeholder='Email'
                            value={user.email}
                            onChange={handleInputChange}
                            disabled={disabledButton}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faAddressBook} />
                        <input
                            name='contact_number'
                            type='text'
                            className='grow'
                            placeholder='Contact Number'
                            value={user.contact_number}
                            onChange={handleInputChange}
                            disabled={disabledButton}
                        />
                    </label>
                    <div className='w-auto flex flex-col items-center sm:flex-row sm:justify-between'>
                        <select
                            className='m-2 select w-60'
                            name='role'
                            value={user.role}
                            onChange={handleInputChange}
                            disabled={disabledButton}
                        >
                            <option value='0'>Employee</option>
                            <option value='1'>Administrator</option>
                        </select>
                        <button className='btn w-auto m-2' disabled={disabledButton}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <span className='hidden sm:inline-block'>Reset Password</span>
                        </button>
                    </div>
                    <div className='w-auto m-2 form-control rounded'>
                        <label className='data-theme label cursor-pointer'>
                            <span className='text-lg'>
                                Active Account: {isChecked ? 'On' : 'Off'}
                            </span>
                            <input
                                type='checkbox'
                                className='toggle'
                                checked={isChecked}
                                onChange={handleToggle}
                                disabled={disabledButton}
                            />
                        </label>
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose('', false)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={disabledButton}
                        >
                            Cancel
                        </button>
                        <button
                            className='btn btn-success mt-2 rounded-md'
                            onClick={updateData}
                            disabled={disabledButton}
                        >
                            Confirm
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UsersModal;
