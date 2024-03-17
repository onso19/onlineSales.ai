import React from 'react';

const FormField = ({ field, formData, handleInputChange, handleCheckboxChange, handleFileUpload, formErrors }) => {
    switch (field.type) {
        case 'text':
            return (
                <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
            );
        case 'number':
            return (
                <input
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
            );
        case 'dropdown':
            return (
                <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                >
                    <option value="">Select Gender</option>
                    {field.options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            );
        case 'checkbox':
            return (
                <div className='checkbox'>
                    <input
                        type="checkbox"
                        checked={formData[field.id] || false}
                        onChange={(e) => handleCheckboxChange(field.id, e.target.checked)}
                    />
                    <label>{field.placeholder}</label>
                </div>
            );
        case 'file':
            return (
                <div>
                    <input
                        className='termsCheckbox'
                        type="checkbox"
                        checked={formData['agreeToTerms'] || false}
                        onChange={(e) => handleCheckboxChange('agreeToTerms', e.target.checked)}
                    />
                    <label className='termsLabel'>I agree to the terms</label>
                    {formData['agreeToTerms'] && (
                        <input
                            type="file"
                            onChange={(e) => handleFileUpload(field.id, e.target.files[0])}
                            className='fileinput'
                        />
                    )}
                    {!formData['agreeToTerms'] && (
                        <span className='conditionsMessage'>Please agree to the terms to upload ID proof</span>
                    )}
                </div>
            );
        default:
            return null;
    }
};

export default FormField;
