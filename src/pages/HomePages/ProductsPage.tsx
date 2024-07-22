import NavBar from '../../Components/NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import ProductsAddModal from '../../Components/Modal/Products/ProductsAddModal';
import axios, { AxiosError } from 'axios';
import LoadingComponent from '../../Components/Common/LoadingComponent';
import ErrorComponent from '../../Components/Common/ErrorComponent';

interface ProductsData {
    id: string;
    name: string;
    price: string;
    quantity: number;
}
const ProductsPage = () => {
    const [products, setProducts] = useState<ProductsData[]>([]);
    const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
    const toggleModal = (type: 'add' | 'edit') => {
        if (type === 'add') {
            setModalType('add');
        }
    };
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1); // State for current page of pagination
    const [totalPages, setTotalPages] = useState<number>(0); // State for total pages of pagination
    const perPage = 10; // Number of items per page
    const startItemNumber = (currentPage - 1) * perPage + 1; // Starting item number for current page

    const fetchData = async (page: number = currentPage) => {
        try {
            const response = await axios.get<{
                products: { current_page: number; data: ProductsData[] };
                meta: { last_page: number };
            }>(`${import.meta.env.VITE_API_ENDPOINT}products?page=${page}&per_page=${perPage}`);
            if (response.status === 200) {
                setProducts(response.data.products.data);
                setCurrentPage(response.data.products.current_page); // Set current page number
                setTotalPages(response.data.meta.last_page); // Set total pages from metadata
                setIsLoading(false);
            }
        } catch (error) {
            handleFetchError(error as AxiosError);
        }
    };

    // Function to handle fetch errors
    const handleFetchError = (error: AxiosError<any>) => {
        setIsLoading(false);
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

    // Function to clear error state and fetch data
    const clearError = () => {
        setError(null);
        setIsLoading(true);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);
    return (
        <>
            <NavBar />
            <div className=' data-theme h-auto w-auto m-16 my-28 border-slate-border-slate-950 rounded'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl'>
                        Products
                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => toggleModal('add')}
                            className='mb-1 ml-3 text-lg cursor-pointer hover:bg-gray-100 rounded'
                        />
                    </div>
                    <div className='ml-auto'>
                        <label className='input input-bordered flex items-center gap-1'>
                            <input type='text' className='flex-grow' placeholder='Search' />
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 16 16'
                                fill='currentColor'
                                className='h-4 w-4 opacity-70'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </label>
                    </div>
                </div>
                {isLoading ? (
                    <LoadingComponent />
                ) : error ? (
                    <ErrorComponent error={error} handleRetry={clearError} />
                ) : products.length > 0 ? (
                    <>
                        <div className='overflow-x-auto  border-inherit	'>
                            <table className='table'>
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Actions</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}

                                    {products.map((data, index) => (
                                        <tr className='hover' key={data.id}>
                                            <th>{startItemNumber + index}</th>
                                            <td>{data.name}</td>
                                            <td>{data.price}</td>
                                            <td>{data.quantity}</td>
                                            <td>
                                                <div className='flex flex-col gap-1 w-14'>
                                                    <button className='btn btn-outline btn-info'>
                                                        Stock In
                                                    </button>
                                                    <button className='btn btn-outline btn-warning'>
                                                        Stock Out
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    className='text-lg cursor-pointer hover:bg-gray-100 rounded'
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='flex justify-center mt-4'>
                                <button
                                    className='join-item btn'
                                    disabled={currentPage <= 1} // Disable previous page button on first page
                                    onClick={() => setCurrentPage(currentPage - 1)} // Go to previous page
                                >
                                    « {/* Previous page button */}
                                </button>
                                <span className='join-item btn'>Page {currentPage}</span>{' '}
                                {/* Current page indicator */}
                                <button
                                    className='join-item btn'
                                    disabled={currentPage >= totalPages} // Disable next page button on last page
                                    onClick={() => setCurrentPage(currentPage + 1)} // Go to next page
                                >
                                    » {/* Next page button */}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                        No data available
                    </div>
                )}
            </div>
            {modalType === 'add' && (
                <ProductsAddModal
                    onClose={(confirm: boolean) => {
                        setModalType(null);

                        if (confirm) {
                            fetchData();
                        }
                    }}
                />
            )}
        </>
    );
};

export default ProductsPage;
