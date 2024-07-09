import NavBar from '../NavBar/NavBar'; // Importing NavBar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon for icons
import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // Importing specific icons from FontAwesome
import { useEffect, useState } from 'react'; // Importing useEffect and useState hooks from React
import SuppliersAddModal from '../Modal/Suppliers/SuppliersAddModal'; // Importing SuppliersAddModal component
import axios, { AxiosError } from 'axios'; // Importing axios for making HTTP requests

// Interface for defining structure of SuppliersData
interface SuppliersData {
    id: string;
    name: string;
    contact_number: string;
    supply_type: string;
}

// Suppliers functional component
const Suppliers = () => {
    const [suppliers, setSuppliers] = useState<SuppliersData[]>([]); // State for storing suppliers data

    const [toggleOpenModal, setToggleOpenModal] = useState<boolean>(false); // State for controlling modal visibility

    const [isLoading, setLoading] = useState<boolean>(false); // State for indicating loading state
    const [error, setError] = useState<string | null>(null); // State for storing error message
    const [currentPage, setCurrentPage] = useState<number>(1); // State for current page number
    const [totalPages, setTotalPages] = useState<number>(0); // State for total number of pages
    const perPage = 10; // Number of items per page
    const startItemNumber = (currentPage - 1) * perPage + 1; // Calculating starting item number for current page

    // Function to toggle the add modal and fetch data upon confirmation
    const toggleAddModal = (confirm: boolean) => {
        setToggleOpenModal((prevState) => !prevState); // Toggling modal state
        if (confirm) {
            fetchData(); // Fetch data if confirmation is true
        }
    };

    // Function to fetch data from API
    const fetchData = async (page: number = currentPage) => {
        try {
            setLoading(true); // Setting loading state to true
            const response = await axios.get(
                `${import.meta.env.VITE_API_ENDPOINT}suppliers?page=${page}&per_page=${perPage}`,
            ); // Making GET request to API
            console.log(response.data);
            if (response.status === 200) {
                // If request is successful
                setSuppliers(response.data.suppliers.data); // Setting suppliers data
                setCurrentPage(response.data.suppliers.current_page); // Setting current page
                setTotalPages(response.data.suppliers.last_page); // Setting total pages
                setLoading(false); // Setting loading state to false
            }
        } catch (error) {
            handleFetchError(error as AxiosError); // Handling fetch error
        }
    };

    // Function to handle fetch errors
    const handleFetchError = (error: AxiosError<any>) => {
        setLoading(false); // Setting loading state to false

        if (error.response) {
            // If there is a response from the server
            const responseData = error.response.data; // Extracting response data
            const errorMessage = responseData.message || 'Unknown error occurred'; // Extracting error message
            setError(`Error ${error.response.status}: ${errorMessage}`); // Setting error state with formatted message
        } else if (error.request) {
            // If the request was made but no response was received
            setError('No response from server. Please try again later.'); // Setting error state
        } else {
            // If something else caused the request to fail
            setError('Error fetching data. Please check your network connection.'); // Setting error state
        }
    };

    // useEffect hook to fetch data initially and on page change
    useEffect(() => {
        fetchData(); // Fetching data on component mount and when currentPage changes
    }, [currentPage]);

    return (
        <>
            <NavBar /> {/* Rendering NavBar component */}
            <div className=' data-theme h-auto w-auto m-16 my-28 border-slate-border-slate-950 rounded'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl'>
                        Suppliers
                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => toggleAddModal(true)}
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
                {/* Rendering loading spinner if isLoading state is true */}
                {/* Rendering error message if error state is true */}
                {/* Rendering suppliers data if suppliers array has items */}
                {/* Rendering no data message if suppliers array is empty */}
                {isLoading ? (
                    <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
                ) : error ? (
                    <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                        {error}
                        {/* Retry button to attempt fetching data again */}
                        <button
                            // onClick={() => clearError}
                            className='ml-2 text-blue-500 hover:underline'
                        >
                            Retry
                        </button>
                    </div>
                ) : suppliers.length > 0 ? (
                    <>
                        <div className='overflow-x-auto  border-inherit	'>
                            <table className='table'>
                                {/* Table header */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Contact Number</th>
                                        <th>Supply Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Rendering each supplier row */}
                                    {suppliers.map((data, index) => (
                                        <tr key={data.id} className='hover'>
                                            <th>{startItemNumber + index}</th>
                                            <td>{data.name}</td>
                                            <td>{data.contact_number}</td>
                                            <td>{data.supply_type}</td>

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
                            {/* Pagination controls */}
                            <div className='flex justify-center mt-4'>
                                {/* Previous page button */}
                                <button
                                    className='join-item btn'
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    «
                                </button>
                                {/* Current page indicator */}
                                <span className='join-item btn'>Page {currentPage}</span>
                                {/* Next page button */}
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
                    <>
                        {' '}
                        <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                            No data available
                        </div>
                    </>
                )}
            </div>
            {/* Rendering SuppliersAddModal if toggleOpenModal state is true */}
            {toggleOpenModal && <SuppliersAddModal onClose={setToggleOpenModal} />}
        </>
    );
};

export default Suppliers; // Exporting Suppliers component
