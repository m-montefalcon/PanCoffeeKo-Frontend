import React from 'react';

const LoadingComponent = () => {
    return (
        <>
            {' '}
            <h3 className='text-lg font-bold mb-2 flex justify-center z-50'>Loading...</h3>
            <span className='loading loading-dots loading-lg flex justify-center w-30 my-10 mx-auto z-0'></span>
        </>
    );
};

export default LoadingComponent;
