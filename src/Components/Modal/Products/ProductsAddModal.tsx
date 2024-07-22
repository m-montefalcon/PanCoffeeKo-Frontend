import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faMessage, faPesoSign, faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';
import InputComponent from '../../Inputs/InputComponent';
import LoadingComponent from '../../Common/LoadingComponent';
import ErrorComponent from '../../Common/ErrorComponent';
import SelectComponent from '../../Inputs/SelectComponent';
import ModalLayoutComponent from '../../Common/ModalLayoutComponent';
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
    photo: File | null;
}

interface OptionData {
    id: string;
    name: string;
}

const initialFormState: FormState = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    product_category_id: '',
    supplier_id: '',
    photo: null,
};

const ProductsAddModal: React.FC<ProductsAddModalProps> = ({ onClose }) => {
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [{ suppliers, categories }, setOptions] = useState<{
        suppliers: OptionData[];
        categories: OptionData[];
    }>({ suppliers: [], categories: [] });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = event.target;

            if (name === 'photo') {
                const fileInput = event.target as HTMLInputElement;
                const file = fileInput.files?.[0];
                setFormState((prevState) => ({
                    ...prevState,
                    photo: file || null,
                }));

                if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setPhotoPreviewUrl(imageUrl);
                } else {
                    setPhotoPreviewUrl(null);
                }
                return;
            }

            setFormState((prevState) => ({
                ...prevState,
                [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value,
            }));
        },
        [],
    );

    const isFormValid = useCallback(() => {
        const { name, description, price, quantity, product_category_id, supplier_id, photo } =
            formState;
        const isEmptyForm =
            !name ||
            !description ||
            price === 0 ||
            quantity === 0 ||
            !product_category_id ||
            !supplier_id ||
            !photo;
        const isPriceValid = /^\d+(\.\d{1,2})?$/.test(price.toString());
        const isQuantityValid = quantity > 0;
        return isEmptyForm || !isPriceValid || !isQuantityValid;
    }, [formState]);

    useEffect(() => {
        setIsDisabledButton(isFormValid());
    }, [formState, isFormValid]);

    const fetchData = useCallback(async () => {
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
            }
        } catch (error) {
            handleFetchError(error as AxiosError);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFetchError = useCallback((error: AxiosError<any>) => {
        if (error.response) {
            const responseData = error.response.data;
            const errorMessage = responseData.message || 'Unknown error occurred';
            setError(`Error ${error.response.status}: ${errorMessage}`);
        } else if (error.request) {
            setError('No response from server. Please try again later.');
        } else {
            setError('Error fetching data. Please check your network connection.');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const postProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.entries(formState).forEach(([key, value]) => {
                if (key === 'photo' && value) {
                    formData.append(key, value);
                } else if (key !== 'photo') {
                    formData.append(key, typeof value === 'number' ? value.toString() : value);
                }
            });

            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}product`,
                formData,
            );

            if (response.status === 200) {
                onClose(true);
            }
        } catch (error) {
            handleFetchError(error as AxiosError);
        } finally {
            setIsLoading(false);
        }
    }, [formState, handleFetchError, onClose]);

    const handleRetry = () => {
        setError(null);
        fetchData();
    };

    return (
        <ModalLayoutComponent>
            {isLoading ? (
                <>
                    <LoadingComponent />
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={() => onClose(false)}
                            className='btn m-2 data-theme rounded-md'
                            disabled={true}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : error ? (
                <>
                    <ErrorComponent error={error} handleRetry={handleRetry} />
                </>
            ) : (
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>
                        Add Product Category
                    </h3>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUtensils} />
                        <InputComponent
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
                        <InputComponent
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
                        <InputComponent
                            name='price'
                            type='number'
                            className='grow'
                            placeholder='Price'
                            value={formState.price}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            min='0.00'
                            step='0.01'
                        />
                    </label>
                    <label className='m-2 input input-bordered flex items-center gap-2'>
                        <FontAwesomeIcon icon={faHashtag} />
                        <InputComponent
                            name='quantity'
                            type='number'
                            className='grow'
                            placeholder='Quantity'
                            value={formState.quantity}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </label>

                    <div className='flex items-center gap-2 justify-center'>
                        <SelectComponent
                            placeholder='Product category'
                            name='product_category_id'
                            className='m-2 select w-80'
                            onChange={handleChange}
                            required
                            disabled={!categories || categories.length === 0 || isLoading}
                            data={categories}
                            value={formState.product_category_id}
                        />
                    </div>

                    <div className='flex items-center gap-2 justify-center'>
                        <SelectComponent
                            placeholder='Supplier'
                            name='supplier_id'
                            className='m-2 select w-80'
                            onChange={handleChange}
                            required
                            disabled={!suppliers || suppliers.length === 0 || isLoading}
                            data={suppliers}
                            value={formState.supplier_id}
                        />
                    </div>
                    <div>
                        <label className='m-2 my-0 py-0 form-control w-full max-w-xs'>
                            <div className=' m-0 label'>
                                <span className='mb-0 label-text'>Product Photo</span>
                            </div>
                            <InputComponent
                                type='file'
                                name='photo'
                                className='my-0 file-input file-input-bordered file-input-sm w-full max-w-xs'
                                onChange={handleChange}
                                placeholder={''}
                                value={''}
                            />
                        </label>
                        {photoPreviewUrl && (
                            <img src={photoPreviewUrl} alt='Preview' className='mt-2 max-w-xs' />
                        )}
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
        </ModalLayoutComponent>
    );
};

export default ProductsAddModal;
