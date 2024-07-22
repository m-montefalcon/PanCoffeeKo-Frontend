import React from 'react';

const ModalLayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-lg rounded-lg p-6 z-100 bg-base-200'>
            {children}
        </div>
    );
};

export default ModalLayoutComponent;
