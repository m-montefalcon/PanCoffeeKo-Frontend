import React from 'react';
interface ErrorComponentProps {
    error: string | null;
    handleRetry: () => void;
}
const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, handleRetry }) => {
    return (
        <>
            {' '}
            <div className='text-2xl flex justify-center text-center mt-9 p-4'>
                {error}
                <button onClick={handleRetry} className='ml-2 text-blue-500 hover:underline'>
                    Retry
                </button>
            </div>
        </>
    );
};

export default ErrorComponent;
