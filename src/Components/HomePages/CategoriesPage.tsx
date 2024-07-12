import NavBar from '../NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import CategoriesAddModal from '../Modal/Categories/CategoriesAddModal';
import CategoriesEditModal from '../Modal/Categories/CategoriesEditModal';
import axios, { AxiosError } from 'axios';
interface CategoriesData {
    id: string;
    name: string;
}
const CategoriesPage = () => {
    const [categories, setCategories] = useState<CategoriesData[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<CategoriesData>();
    const [toggleOpenModal, setToggleOpenModal] = useState<boolean>(false);
    const [toggleOpenEditModal, setToggleOpenEditModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const perPage = 10;
    const startItemNumber = (currentPage - 1) * perPage + 1;

    const toggleAddModal = (confirm: boolean) => {
        setToggleOpenModal((prevState) => !prevState);
        if (confirm) {
            fetchData();
        }
    };

    const toggleEditModal = (data: CategoriesData) => {
        setSelectedCategory(data);
        if (selectedCategory) {
            console.log(selectedCategory);
        }

        setToggleOpenEditModal(true);
    };
    const fetchData = async (page: number = currentPage) => {
        setIsLoading(true);
        try {
            const response = await axios.get<{
                categories: { current_page: number; data: CategoriesData[] };
                meta: { last_page: number };
            }>(`${import.meta.env.VITE_API_ENDPOINT}categories?page=${page}&per_page=${perPage}`);

            if (response.status === 200) {
                console.log(response.data);
                setCategories(response.data.categories.data);
                setCurrentPage(response.data.categories.current_page);
                setTotalPages(response.data.meta.last_page);
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
            <div className=' data-theme h-auto w-auto m-16 my-28  border-slate-border-slate-950 rounded'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl'>
                        Product Categories
                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => {
                                toggleAddModal(false);
                            }}
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
                    <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
                ) : error ? (
                    <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                        {error}
                        <button onClick={clearError} className='ml-2 text-blue-500 hover:underline'>
                            Retry
                        </button>
                    </div>
                ) : categories.length > 0 ? (
                    <>
                        <div className='overflow-x-auto  border-inherit	'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((data, index) => (
                                        <tr key={data.id} className='hover'>
                                            <th>{startItemNumber + index}</th>
                                            <td>{data.name}</td>
                                            <td>
                                                <FontAwesomeIcon
                                                    onClick={() => toggleEditModal(data)}
                                                    icon={faPenToSquare}
                                                    className='text-lg cursor-pointer hover:bg-gray-100 rounded'
                                                />
                                            </td>
                                            <td>
                                                <FontAwesomeIcon
                                                    // onClick={() => toggleEditModal(data)}
                                                    icon={faTrash}
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
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    «
                                </button>
                                <span className='join-item btn'>Page {currentPage}</span>
                                <button
                                    className='join-item btn'
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    »
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
            {toggleOpenEditModal && (
                <CategoriesEditModal
                    onClose={(confirm) => {
                        setToggleOpenEditModal(false); // Ensure this closes the modal
                        if (confirm) {
                            fetchData(); // Optionally fetch data upon confirmation
                        }
                    }}
                    category={selectedCategory as CategoriesData}
                />
            )}

            {toggleOpenModal && <CategoriesAddModal onClose={toggleAddModal} />}
        </>
    );
};

export default CategoriesPage;
