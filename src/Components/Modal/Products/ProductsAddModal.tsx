import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faMessage, faPesoSign, faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';

interface ProductsAddModalProps {
    onClose: (confirm: boolean) => void;
}

interface FormState {
    name: string;
    description: string;
    price: number;
    quantity: number;
    product_category_id: string;
    supplier_id: string;
}

interface OptionData {
    id: string;
    name: string;
}

const ProductsAddModal: React.FC<ProductsAddModalProps> = ({ onClose }) => {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        product_category_id: '',
        supplier_id: '',
    });

    const [{ suppliers, categories }, setOptions] = useState<{
        suppliers: OptionData[];
        categories: OptionData[];
    }>({
        suppliers: [],
        categories: [],
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const isFormValid = () => {
        const { name, description, price, quantity, product_category_id, supplier_id } = formState;
        const isEmptyForm =
            !name ||
            !description ||
            price === 0 ||
            quantity === 0 ||
            !product_category_id ||
            !supplier_id;
        const isPriceValid = /^\d+(\.\d{1,2})?$/.test(price.toString());
        const isQuantityValid = quantity > 0;
        return isEmptyForm || !isPriceValid || !isQuantityValid;
    };

    useEffect(() => {
        setIsDisabledButton(isFormValid());
    }, [formState]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<{
                suppliers: OptionData[];
                categories: OptionData[];
            }>(`${import.meta.env.VITE_API_ENDPOINT}products-information`);
            if (response.status === 200) {
                setOptions({
                    suppliers: response.data.suppliers,
                    categories: response.data.categories,
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            handleFetchError(error as AxiosError);
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

    useEffect(() => {
        fetchData();
    }, []);

    const postProduct = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}product`,
                formState,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.status === 200) {
                console.log('success');
                onClose(true);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            handleFetchError(error as AxiosError);
        }
    };

    const handleRetry = () => {
        setError(null);
        fetchData();
    };

    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {isLoading ? (
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>Loading...</h3>
                    <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose(false)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={true} // Always disabled during loading
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : error ? (
                <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                    {error}
                    <button onClick={handleRetry} className='ml-2 text-blue-500 hover:underline'>
                        Retry
                    </button>
                </div>
            ) : (
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
                            value={formState.name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faMessage} />
                        <input
                            name='description'
                            type='text'
                            className='grow'
                            placeholder='Product description'
                            value={formState.description}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faPesoSign} />
                        <input
                            name='price'
                            type='number'
                            min='0.00'
                            step='0.01'
                            className='grow'
                            placeholder='Price'
                            value={formState.price}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faHashtag} />
                        <input
                            name='quantity'
                            type='number'
                            className='grow'
                            placeholder='quantity'
                            value={formState.quantity}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </label>

                    <div className='flex items-center gap-2 justify-center'>
                        <select
                            className='m-2 select w-80'
                            name='product_category_id'
                            value={formState.product_category_id}
                            onChange={handleChange}
                            required
                            disabled={!categories || categories.length === 0 || isLoading}
                        >
                            {!categories || categories.length === 0 ? (
                                <option value='' disabled>
                                    No categories available
                                </option>
                            ) : (
                                <>
                                    <option value='' disabled>
                                        Select category
                                    </option>
                                    {categories.map((data) => (
                                        <option key={data.id} value={data.id}>
                                            {data.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div className='flex items-center gap-2 justify-center'>
                        <select
                            className='m-2 select w-80'
                            name='supplier_id'
                            value={formState.supplier_id}
                            onChange={handleChange}
                            required
                            disabled={!suppliers || suppliers.length === 0 || isLoading}
                        >
                            {!suppliers || suppliers.length === 0 ? (
                                <option value='' disabled>
                                    No suppliers available
                                </option>
                            ) : (
                                <>
                                    <option value='' disabled>
                                        Select supplier
                                    </option>
                                    {suppliers.map((data) => (
                                        <option key={data.id} value={data.id}>
                                            {data.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose(false)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className='btn btn-success mt-2 rounded-md'
                            disabled={isDisabledButton || isLoading}
                            onClick={postProduct}
                        >
                            {isLoading ? 'Adding...' : 'Confirm'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductsAddModal;
