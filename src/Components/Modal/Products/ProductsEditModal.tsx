import { useEffect, useState, useCallback } from 'react';
import ModalLayoutComponent from '../../Common/ModalLayoutComponent';
import LoadingComponent from '../../Common/LoadingComponent';
import ErrorComponent from '../../Common/ErrorComponent';
import axios from 'axios';
import { faMessage, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputComponent from '../../Inputs/InputComponent';
import { faPesoSign } from '@fortawesome/free-solid-svg-icons/faPesoSign';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import SelectComponent from '../../Inputs/SelectComponent';

interface ProductsEditModalProps {
    onClose: (confirm: boolean) => void;
    id: string;
}

interface FormState {
    name: string;
    description: string;
    price: number;
    quantity: number;
    product_category_id: string;
    supplier_id: string;
    photo: File | null;
    image_url?: string;
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

const ProductsEditModal: React.FC<ProductsEditModalProps> = ({ onClose, id }) => {
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

    const [{ suppliers, categories }, setOptions] = useState<{
        suppliers: OptionData[];
        categories: OptionData[];
    }>({ suppliers: [], categories: [] });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRetry = () => {
        fetchData();
    };

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

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}product/${id}`);
            if (response.status === 200) {
                const productData = response.data.product;
                setFormState(productData);
                setOptions({
                    suppliers: response.data.suppliers,
                    categories: response.data.categories,
                });
                if (productData.image_url) {
                    setPhotoPreviewUrl(
                        `${import.meta.env.VITE_STORAGE_ENDPOINT}${productData.image_url}`,
                    );
                }
            }
        } catch (error) {
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };
    const editProduct = async () => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', formState.name);
        formData.append('description', formState.description);
        formData.append('price', formState.price.toString());
        formData.append('quantity', formState.quantity.toString());
        formData.append('product_category_id', formState.product_category_id);
        formData.append('supplier_id', formState.supplier_id);

        if (formState.photo) {
            formData.append('photo', formState.photo);
        }

        formData.append('_method', 'PUT');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}product`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            if (response.status === 200) {
                onClose(true);
            }
        } catch (error) {
            setError(`${error}`);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

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
                <ErrorComponent error={error} handleRetry={handleRetry} />
            ) : (
                <>
                    <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>
                        Edit Product Category
                    </h3>
                    {photoPreviewUrl && (
                        <div className='flex justify-center mb-4'>
                            <img
                                src={photoPreviewUrl}
                                alt='Product'
                                className='w-60 h-60 object-cover rounded'
                            />
                        </div>
                    )}
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
                            <div className='m-0 label'>
                                <span className='mb-0 label-text'>Product Photo</span>
                            </div>
                            <input
                                type='file'
                                name='photo'
                                className='my-0 file-input file-input-bordered file-input-sm w-full max-w-xs'
                                onChange={handleChange}
                            />
                        </label>
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
                            // disabled={isDisabledButton || isLoading}
                            onClick={editProduct}
                        >
                            {isLoading ? 'Adding...' : 'Confirm'}
                        </button>
                    </div>
                </>
            )}
        </ModalLayoutComponent>
    );
};

export default ProductsEditModal;
