import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SideNavList as SideNavListType } from '../../interface/SideNavLists';

const SideNavList = ({ pathname, icon, name }: SideNavListType) => {
    const location = useLocation();

    const path = `/${pathname}`;
    return (
        <>
            <li className='mb-1'>
                {location.pathname === `/${pathname}` ? (
                    <span className='flex items-center p-2 text-xl bg-gray-200 cursor-not-allowed rounded'>
                        <FontAwesomeIcon icon={icon} className='mr-2' />
                        {name}
                    </span>
                ) : (
                    <Link to={path} className='flex items-center p-2 text-xl  hover:bg-gray-200 '>
                        <FontAwesomeIcon icon={icon} className='mr-2' />
                        {name}
                    </Link>
                )}
            </li>
        </>
    );
};

export default SideNavList;
