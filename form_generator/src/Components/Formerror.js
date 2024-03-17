import React from 'react';

const ErrorForm = ({ error }) => {
    return (
        error && <span className='error'>{error}</span>
    );
};

export default ErrorForm;
