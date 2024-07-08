import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
interface UserAddModalProps {
    onClose: (confirm: boolean) => void;
}
interface UserDetails {
    name: string;
    contact_number: string;
    role: string;
    email: string;
    password: string;
    confirm_password: string;
}
const UsersAddModal: React.FC<UserAddModalProps> = ({ onClose }) => {
    const [userForm, setUser] = useState<UserDetails>({
        name: '',
        contact_number: '',
        role: '0',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [disabledButton, setDisabledButton] = useState(false);
    const [disabledSubmitButton, setDisabledSubmitButton] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setUser((prev) => ({ ...prev, [name]: value }));
        console.log(`${name} : ${value}`);
    };

    const registerUser = async () => {
        setDisabledButton(true);
        setDisabledSubmitButton(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_URL}user/register`,
                userForm,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            );
            if (response.status === 200) {
                onClose(true);
            }
        } catch (error) {
            handleFetchError(error as AxiosError<any>);
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
            setError('Error fetching data. Please check your network connection.');
        }
    };

    // Call the validator function when userForm changes

    const validator = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(userForm.email);
        const isPasswordNotEmpty = userForm.password !== '';
        const isPasswordAndConfirmPasswordSame = userForm.password === userForm.confirm_password; // Check if passwords match
        const isNameNotEmpty = userForm.name !== '';

        // Update disabledButton based on all conditions
        setDisabledSubmitButton(
            !isValidEmail ||
                !isPasswordNotEmpty ||
                !isPasswordAndConfirmPasswordSame ||
                !isNameNotEmpty,
        );
    };
    useEffect(() => {
        validator();
    }, [userForm]); // Include userForm in the dependency array
    const handleRetry = () => {
        setError(null); // Clear the error state
        setDisabledButton(false);
        validator();
    };
    return (
        <>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
                {error ? (
                    <>
                        {' '}
                        <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                            {error}
                            <button
                                onClick={handleRetry}
                                className='ml-2 text-blue-500 hover:underline'
                            >
                                Retry
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {' '}
                        <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>
                            Add User
                        </h3>
                        <label className='m-2 input input-bordered flex items-center gap-2'>
                            <FontAwesomeIcon icon={faUser} />
                            <input
                                name='name'
                                type='text'
                                className='grow'
                                placeholder='Name'
                                value={userForm.name}
                                onChange={handleInputChange}
                                required
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
                                value={userForm.email}
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
                                value={userForm.contact_number}
                                maxLength={11}
                                onChange={handleInputChange}
                                required
                                disabled={disabledButton}
                            />
                        </label>
                        <label className='m-2 input input-bordered flex items-center gap-2'>
                            <FontAwesomeIcon icon={faKey} />
                            <input
                                name='password'
                                type='password'
                                className='grow'
                                placeholder='Password'
                                value={userForm.password}
                                onChange={handleInputChange}
                                required
                                disabled={disabledButton}
                            />
                        </label>
                        <label className='m-2 input input-bordered flex items-center gap-2'>
                            <FontAwesomeIcon icon={faKey} />
                            <input
                                name='confirm_password'
                                type='password'
                                className='grow'
                                placeholder='Confirm Password'
                                value={userForm.confirm_password}
                                onChange={handleInputChange}
                                required
                                disabled={disabledButton}
                            />
                        </label>
                        <div className='flex items-center gap-2 justify-center'>
                            <select
                                className='m-2 select w-80'
                                name='role'
                                value={userForm.role}
                                onChange={handleInputChange}
                                required
                                disabled={disabledButton}
                            >
                                <option value='0'>Employee</option>
                                <option value='1'>Administrator</option>
                            </select>
                        </div>
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
                                onClick={registerUser}
                                disabled={disabledSubmitButton}
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default UsersAddModal;
