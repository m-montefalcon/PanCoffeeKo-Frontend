import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';
import CategoriesAddModal from '../../Components/Modal/Categories/CategoriesAddModal';
import CategoriesEditModal from '../../Components/Modal/Categories/CategoriesEditModal';
import CategoriesDeleteModal from '../../Components/Modal/Categories/CategoriesDeleteModal';

// Interface for category data structure
interface CategoriesData {
    id: string;
    name: string;
}

const CategoriesPage: React.FC = () => {
    // State hooks for managing component state
    const [categories, setCategories] = useState<CategoriesData[]>([]); // State for storing categories data
    const [selectedCategory, setSelectedCategory] = useState<CategoriesData | null>(null); // State for selected category in modals
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null); // State for current modal type (add, edit, delete)
    const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error messages
    const [currentPage, setCurrentPage] = useState<number>(1); // State for current page of pagination
    const [totalPages, setTotalPages] = useState<number>(0); // State for total pages of pagination
    const perPage = 10; // Number of items per page
    const startItemNumber = (currentPage - 1) * perPage + 1; // Starting item number for current page

    // Function to fetch data from API based on page number
    const fetchData = async (page: number = currentPage) => {
        setIsLoading(true); // Set loading state to true
        try {
            // Make API request to fetch categories data
            const response = await axios.get<{
                categories: { current_page: number; data: CategoriesData[] }; // Shape of categories data in response
                meta: { last_page: number }; // Metadata containing last page number
            }>(`${import.meta.env.VITE_API_ENDPOINT}categories?page=${page}&per_page=${perPage}`);

            // Upon successful response
            if (response.status === 200) {
                setCategories(response.data.categories.data); // Set fetched categories data
                setCurrentPage(response.data.categories.current_page); // Set current page number
                setTotalPages(response.data.meta.last_page); // Set total pages from metadata
            }
        } catch (error) {
            handleFetchError(error as AxiosError); // Handle API fetch errors
        } finally {
            setIsLoading(false); // Always set loading state to false after fetch attempt
        }
    };

    // Function to handle errors from API fetch
    const handleFetchError = (error: AxiosError<any>) => {
        setIsLoading(false); // Set loading state to false on error
        if (error.response) {
            const responseData = error.response.data; // Get error response data
            const errorMessage = responseData.message || 'Unknown error occurred'; // Extract error message
            setError(`Error ${error.response.status}: ${errorMessage}`); // Set formatted error message
        } else if (error.request) {
            setError('No response from server. Please try again later.'); // No response from server error
        } else {
            setError('Error fetching data. Please check your network connection.'); // Other network errors
        }
    };

    // Function to clear error state and refetch data
    const clearError = () => {
        setError(null); // Clear error message
        fetchData(); // Refetch data
    };

    // Function to toggle modal based on type (add, edit, delete)
    const toggleModal = (type: 'add' | 'edit' | 'delete', data?: CategoriesData) => {
        setSelectedCategory(data || null); // Set selected category for modal
        setModalType(type); // Set modal type (add, edit, delete)
    };

    // Effect hook to fetch data when currentPage changes
    useEffect(() => {
        fetchData(); // Fetch data when currentPage changes
    }, [currentPage]); // Depend on currentPage state change

    // JSX return for rendering the component
    return (
        <>
            <NavBar /> {/* Render the navigation bar component */}
            {/* Container for categories data */}
            <div className='data-theme h-auto w-auto m-16 my-28 border-slate-border-slate-950 rounded'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl'>
                        Product Categories {/* Header for product categories */}
                        {/* Icon button for adding new category */}
                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => toggleModal('add')} // Open 'add' modal on click
                            className='mb-1 ml-3 text-lg cursor-pointer hover:bg-gray-100 rounded'
                        />
                    </div>
                    <div className='ml-auto'>
                        <label className='input input-bordered flex items-center gap-1'>
                            <input type='text' className='flex-grow' placeholder='Search' />{' '}
                            {/* Search input */}
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

                {/* Conditional rendering based on loading, error, and categories data */}
                {isLoading ? ( // Show loading indicator
                    <div className='flex justify-center w-30 my-10 mx-auto'>
                        <div className='loading loading-dots loading-lg'></div>
                    </div>
                ) : error ? ( // Show error message
                    <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                        {error} {/* Display error message */}
                        <button onClick={clearError} className='ml-2 text-blue-500 hover:underline'>
                            Retry {/* Retry button to fetch data again */}
                        </button>
                    </div>
                ) : categories.length > 0 ? ( // Render table if categories exist
                    <>
                        <div className='overflow-x-auto border-inherit'>
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
                                            <td>{startItemNumber + index}</td>
                                            <td>{data.name}</td>
                                            <td>
                                                <FontAwesomeIcon
                                                    onClick={() => toggleModal('edit', data)} // Open 'edit' modal
                                                    icon={faPenToSquare}
                                                    className='text-lg cursor-pointer hover:bg-gray-100 rounded'
                                                />
                                            </td>
                                            <td>
                                                <FontAwesomeIcon
                                                    onClick={() => toggleModal('delete', data)} // Open 'delete' modal
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
                    // No categories available
                    <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                        No data available
                    </div>
                )}
            </div>
            {/* Render modals based on modalType state */}
            {modalType === 'add' && (
                <CategoriesAddModal
                    onClose={(confirm) => {
                        setModalType(null); // Close modal
                        if (confirm) {
                            fetchData(); // Refetch data if delete confirmed
                        }
                    }}
                />
            )}
            {/* Add category modal */}
            {modalType === 'edit' && ( // Edit category modal
                <CategoriesEditModal
                    onClose={(confirm) => {
                        setModalType(null); // Close modal
                        if (confirm) {
                            fetchData(); // Refetch data if edit confirmed
                        }
                    }}
                    category={selectedCategory as CategoriesData} // Pass selected category data
                />
            )}
            {modalType === 'delete' && ( // Delete category modal
                <CategoriesDeleteModal
                    onClose={(confirm) => {
                        setModalType(null); // Close modal
                        if (confirm) {
                            fetchData(); // Refetch data if delete confirmed
                        }
                    }}
                    category={selectedCategory as CategoriesData} // Pass selected category data
                />
            )}
        </>
    );
};

export default CategoriesPage; // Export CategoriesPage component
