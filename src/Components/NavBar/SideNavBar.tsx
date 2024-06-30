import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SideNavBarProps } from '../../interface/SideNavBarProps';
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
                        <li>
                            <Link
                                to='/'
                                className='flex items-center p-2 hover:bg-gray-200 text-xl'
                            >
                                <span>
                                    <FontAwesomeIcon icon={faChartSimple} className='mr-4' />
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='flex items-center p-2 hover:bg-gray-200 text-xl'
                            >
                                <span>
                                    <FontAwesomeIcon icon={faUsers} className='mr-2' />
                                    Users
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='flex items-center p-2 hover:bg-gray-200 text-xl'
                            >
                                <span>
                                    <FontAwesomeIcon icon={faBoxOpen} className='mr-1' /> Products
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='flex items-center p-2 hover:bg-gray-200 text-xl'
                            >
                                <span>
                                    <FontAwesomeIcon icon={faUtensils} className='mr-3' />{' '}
                                    Categories
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='flex items-center p-2 hover:bg-gray-200 text-xl'
                            >
                                <span>
                                    <FontAwesomeIcon icon={faBoxesPacking} className='mr-2' />{' '}
                                    Suppliers
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='flex items-center p-2 hover:bg-gray-200 text-xl'
                            >
                                <span>
                                    <FontAwesomeIcon icon={faReceipt} className='mr-3 pl-2' />
                                    {'  '}
                                    Transactions
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SideNavBar;
