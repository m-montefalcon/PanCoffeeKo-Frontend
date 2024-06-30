import { SideNavBarProps } from '../../interface/SideNavBarProps';
import SideNavList from './SideNavList';
import {
    faChartSimple,
    faUsers,
    faBoxOpen,
    faUtensils,
    faBoxesPacking,
    faReceipt,
} from '@fortawesome/free-solid-svg-icons';

const SideNavBar = ({ isSidebarOpen, closeSidebar }: SideNavBarProps) => {
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-80 bg-base-200 z-10 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition duration-300 ease-in-out`}
            >
                <div className='p-4'>
                    <div className='flex justify-between items-center mb-4'>
                        <h1 className='text-2xl font-bold'>PanCoffeeKo ☕</h1>
                        <button className='btn btn-square btn-ghost' onClick={closeSidebar}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                className='inline-block h-5 w-5 stroke-current'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <ul>
                        <SideNavList pathname='home' icon={faChartSimple} name='Dashboard' />
                        <SideNavList pathname='users' icon={faUsers} name='Users' />
                        <SideNavList pathname='products' icon={faBoxOpen} name='Products' />
                        <SideNavList pathname='categories' icon={faUtensils} name='Categories' />
                        <SideNavList pathname='suppliers' icon={faBoxesPacking} name='Suppliers' />
                        <SideNavList pathname='transactions' icon={faReceipt} name='Transactions' />
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SideNavBar;
