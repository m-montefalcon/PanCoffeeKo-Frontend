import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import NavBar from '../NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import UsersEditModal from '../Modal/Users/UsersEditModal';
import UsersAddModal from '../Modal/Users/UsersAddModal';
interface UserData {
    id: string;
    name: string;
    role: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]); //Set useState for users with interface UserData in a array type
    const [isLoading, setIsLoading] = useState<boolean>(false); //Set useState for conditional rendering in loading
    const [openEditModal, setOpenEditModal] = useState<boolean>(false); //Set useState for state management of opening the modal
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null); //Set useState for fetching the error
    const [currentPage, setCurrentPage] = useState<number>(1); //Set useState for current number of pages defaulted by one
    const [totalPages, setTotalPages] = useState<number>(0); //Set useState for total pages
    const [selectedUserId, setSelectedUserId] = useState<string>('');

    const perPage = 15; // Number of items per page

    //Function the toggle the modal state
    const toggleModal = (userId: string, confirmed: boolean = false) => {
        setSelectedUserId(userId);
        setOpenEditModal((prevState) => !prevState);
        if (confirmed) {
            fetchData(); // Refresh data if the modal was closed due to confirmation
        }
    };
    //Function the toggle the modal state
    const toggleAddModal = (confirmed: boolean = false) => {
        setOpenAddModal((prevState) => !prevState);
        if (confirmed) {
            fetchData();
        }
    };

    //Function where fetch the data to the backend server where parameter is the page number is the current value of currentPage useState
    const fetchData = async (page: number = currentPage) => {
        setIsLoading(true); //Set the loading state into true

        //Set try catch error to catch the unforeseen error
        try {
            const response = await axios.get<{
                users: { current_page: number; data: UserData[] }; //Define the expected structure of the response data which will be the current_page is number and data will be an array consisting the interface UserData
                meta: { last_page: number }; //Define expected structure of the response meta data
            }>(`${import.meta.env.VITE_API_ENDPOINT}users?page=${page}&per_page=${perPage}`);

            console.log(response.data); // Log the raw response data
            setUsers(response.data.users.data); // Extract and set the user data from the response
            setTotalPages(response.data.meta.last_page); // Set the total number of pages from the meta data
            setIsLoading(false); // Set loading state to false since data fetching is complete
            setError(null); // Clear any previous error state
        } catch (error) {
            // Handle errors that occur during the fetch operation
            console.error('Caught error:', error); // Log the error to the console
            handleFetchError(error as AxiosError<any>); // Call a function to handle specific Axios errors with parameter error cast as AxiosError type
        }
    };

    const handleFetchError = (error: AxiosError<any>) => {
        setIsLoading(false); // Set isLoading state to false to indicate loading is complete

        if (error.response) {
            // If there is a response from the server (even if it's an error response)
            const responseData = error.response.data; // Extract the response data
            const errorMessage = responseData.message || 'Unknown error occurred'; // Get error message from response data or set a default message
            setError(`Error ${error.response.status}: ${errorMessage}`); // Set error state with formatted error message
        } else if (error.request) {
            // If the request was made but no response was received (e.g., server didn't respond)
            setError('No response from server. Please try again later.'); // Set error state indicating no response from server
        } else {
            // If something else caused the request to fail (e.g., network issue)
            setError('Error fetching data. Please check your network connection.'); // Set error state indicating general fetch error
        }
    };

    //Function that clears the error and try to fetch the data
    const clearError = () => {
        setError(null);
        fetchData();
    };

    //useEffect state on fetching data
    useEffect(() => {
        fetchData();
    }, [currentPage]); // Fetch data when currentPage changes

    // Calculate item numbers for display
    const startItemNumber = (currentPage - 1) * perPage + 1;

    return (
        <>
            {/* NavBar */}
            <NavBar />
            {/* Headers and the search bar (Will separate this container) */}
            <div className='data-theme relative h-auto w-auto m-24 border-slate-border-slate-950 rounded z-0'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl'>
                        Users{' '}
                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => toggleAddModal(false)}
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

                {/* Table */}
                <div className='overflow-x-auto border-inherit z-0'>
                    {/* If the loading state is true then pop the loading dots component*/}

                    {isLoading ? (
                        <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
                    ) : error ? (
                        <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                            {error}
                            {/* Also if the error state is true, it will show error component */}
                            {/* A button which allow to clear the error and fetch data again*/}
                            <button
                                onClick={() => clearError}
                                className='ml-2 text-blue-500 hover:underline'
                            >
                                Retry
                            </button>
                        </div>
                    ) : users.length > 0 ? (
                        <>
                            {/* If the length of the users array is more than 0, then show a table*/}
                            <table className='relative table z-0'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map the user data array*/}
                                    {users.map((user, index) => (
                                        <tr className='hover' key={user.id}>
                                            <td>{startItemNumber + index}</td>
                                            <td>{user.name}</td>
                                            <td>{user.role === '0' ? 'Employee' : 'Admin'}</td>
                                            {/* Edit Icon button which allows to toggle the modal to the UsersModa*/}
                                            <td>
                                                <FontAwesomeIcon
                                                    onClick={() => {
                                                        toggleModal(user.id);
                                                    }}
                                                    icon={faPenToSquare}
                                                    className='text-lg cursor-pointer hover:bg-gray-100 rounded'
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination Component*/}
                            <div className='flex justify-center mt-4'>
                                {/* Button where it will be disabled if the current page is less than or equal to one,
                                    If enabled and clicked, decrement current page
                                
                                */}

                                <button
                                    className='join-item btn'
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    «
                                </button>
                                {/*Shows the current page*/}
                                <span className='join-item btn'>Page {currentPage}</span>

                                {/* Button where it will be disabled if the current page greater or equal to total pages,
                                    If enabled and clicked, increment current page
                                */}
                                <button
                                    className='join-item btn'
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    »
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                            No data available
                            {/*If users length is equal to zero, then show component that no data available*/}
                        </div>
                    )}
                </div>
            </div>
            {/* Render UsersModal based on openModal state */}
            {openEditModal && (
                <UsersEditModal onClose={toggleModal} selectedUserId={selectedUserId} />
            )}
            {openAddModal && <UsersAddModal onClose={toggleAddModal} />}
        </>
    );
};

export default UsersPage;
