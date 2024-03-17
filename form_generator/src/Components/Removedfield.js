import React from 'react';

const RemovedField = ({ field, handleAddBackField }) => {
    return (
        <div className='removed-button'>
            <span className='removed'>{field.placeholder} - Removed</span>
            <button className='addBack' type="button" onClick={() => handleAddBackField(field)}>Add Back</button>
        </div>
    );
};

export default RemovedField;
