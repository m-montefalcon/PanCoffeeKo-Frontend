import { useEffect, useState } from 'react';
import EmailInputComponent from '../InputComponents/EmailInputComponent';
import PasswordInputComponent from '../InputComponents/PasswordInputComponent';
import HyperlinkComponent from '../assets/HyperlinkComponents/HyperlinkComponent';
const LoginPage = () => {
    //Interface for form data
    interface FormData {
        email: string;
        password: string;
    }

    //Use State for login form data
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [isDisabledButton, setDisabledButton] = useState(true);

    //Handles event in every changed data
    const onChangedData = (name: string, value: string) => {
        // Basic email format validation using regex

        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
        console.log(`${name} ${value}`);
    };

    //Handles submitting form
    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(formData);
    };

    useEffect(() => {
        const validator = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValidEmail = emailRegex.test(formData.email);
            const isPasswordValid = formData.password !== '';
            setDisabledButton(!isValidEmail || !isPasswordValid);
        };
        validator();
    }, [formData]);
    return (
        <>
            <form onSubmit={handleLogin}>
                <div className='h-screen flex justify-center items-center bg-gradient-to-t from-[#F8F4E1] to-[#AF8F6F]'>
                    <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
                        <div className='mb-6 text-center'>
                            <h2 className='text-3xl font-bold text-gray-800 my-6'>
                                PanCoffeeKo Portal ☕
                            </h2>
                            <div className='flex justify-start my-2 font-bold'>Your email</div>
                            <EmailInputComponent onChangeFunction={onChangedData} />

                            <div className='flex justify-start my-2 font-bold'>Password</div>

                            <PasswordInputComponent onChangeFunction={onChangedData} />
                            <div className='text-right'>
                                <HyperlinkComponent href='#' content='Forgot Password' />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-1'>
                            <button
                                disabled={isDisabledButton}
                                type='submit'
                                className={
                                    !isDisabledButton
                                        ? 'bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300'
                                        : 'bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 opacity-60 cursor-not-allowed'
                                }
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
