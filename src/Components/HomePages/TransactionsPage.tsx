import NavBar from '../NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
const TransactionsPage = () => {
    return (
        <>
            <NavBar />
            <div className=' data-theme h-auto w-auto m-16 border-slate-border-slate-950 rounded'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl'>Transactions</div>
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

                <div className='overflow-x-auto  border-inherit	'>
                    <table className='table'>
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr className='hover'>
                                <th>1</th>
                                <td>Cy Ganderton</td>
                                <td>Quality Control Specialist</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className='text-lg cursor-pointer hover:bg-gray-100 rounded'
                                    />
                                </td>
                            </tr>
                            {/* row 2 */}
                            <tr className='hover'>
                                <th>2</th>
                                <td>Hart Hagerty</td>
                                <td>Desktop Support Technician</td>
                                <td>Purple</td>
                            </tr>
                            {/* row 3 */}
                            <tr className='hover'>
                                <th>3</th>
                                <td>Brice Swyre</td>
                                <td>Tax Accountant</td>
                                <td>Red</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TransactionsPage;
