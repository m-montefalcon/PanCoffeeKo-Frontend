import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideNavBar from './SideNavBar';

const NavBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<Boolean>(false);

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme !== null ? savedTheme : 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const localTheme = localStorage.getItem('theme');
        document.querySelector('html')?.setAttribute('data-theme', localTheme ?? 'light');
    }, [theme]);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const toggleTheme = (e: ChangeEvent<HTMLInputElement>) => {
        return e.target.checked ? setTheme('dark') : setTheme('light');
    };
    return (
        <>
            {/* Navbar */}
            <div className='navbar bg-base-100'>
                {/* Hamburger Menu */}
                <div className='flex-none'>
                    <button className='btn btn-square btn-ghost' onClick={toggleSidebar}>
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
                                d='M4 6h16M4 12h16M4 18h16'
                            ></path>
                        </svg>
                    </button>
                </div>
                {/* Logo */}
                <div className='flex-1'>
                    <Link to='/' className='text-2xl ml-4'>
                        PanCoffeeKo ☕
                    </Link>
                </div>
                {/* User Menu */}
                <div className='flex-none'>
                    <ul className='menu menu-horizontal px-0'>
                        <li>
                            <details>
                                <summary className='w-48 text-lg'>Kendrick Lamar</summary>
                                <ul className='bg-base-100 rounded-t-none p-2'>
                                    <li>
                                        <a className='text-base'>Account settings</a>
                                    </li>
                                    <li className='inline-block'>
                                        <span>
                                            <label className='text-base'>Dark Mode</label>
                                            <label className='grid cursor-pointer place-items-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={theme == 'dark' ? true : false}
                                                    className=' toggle  theme-controller bg-base-content col-span-2 col-start-1 row-start-1'
                                                    onChange={toggleTheme}
                                                />
                                                <svg
                                                    className='stroke-base-100 fill-base-100 col-start-1 row-start-1'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='14'
                                                    height='14'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                >
                                                    <circle cx='12' cy='12' r='5' />
                                                    <path d='M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' />
                                                </svg>
                                                <svg
                                                    className='stroke-base-100 fill-base-100 col-start-2 row-start-1'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='14'
                                                    height='14'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                >
                                                    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
                                                </svg>
                                            </label>
                                        </span>
                                    </li>

                                    <li>
                                        <a className='text-base'>Logout</a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
            <SideNavBar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        </>
    );
};

export default NavBar;
