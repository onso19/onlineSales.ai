
import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormError from './Formerror';
import RemovedField from './Removedfield';
import './form.css';

const FormGenerator = () => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [removedFields, setRemovedFields] = useState([]);
    const [submittedForms, setSubmittedForms] = useState([]);
    const [showSubmittedForms, setShowSubmittedForms] = useState(false);

    useEffect(() => {
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            const parsedData = JSON.parse(savedFormData);
            setFormFields(parsedData.formFields || []);
            setFormData(parsedData.formData || {});
            setFormErrors(parsedData.formErrors || {});
            setRemovedFields(parsedData.removedFields || []);
            setSubmittedForms(parsedData.submittedForms || []);
        }
    }, []);

    const saveFormDataToLocalStorage = (dataToSave) => {
        localStorage.setItem('formData', JSON.stringify(dataToSave));
    };

    const addFields = (fields) => {
        const newFields = fields.map(field => {
            return {
                type: field.type,
                id: Math.random().toString(),
                options: field.type === 'dropdown' ? ['Male', 'Female', 'Other'] : [],
                placeholder: field.placeholder,
                required: field.required || false,
                minLength: field.minLength || 0,
                maxLength: field.maxLength || Infinity,
                format: field.format || null
            };
        });

        setFormFields([...formFields, ...newFields]);

        const newFormData = { ...formData };
        const newFormErrors = { ...formErrors };

        newFields.forEach(newField => {
            newFormData[newField.id] = '';
            newFormErrors[newField.id] = '';
        });

        setFormData(newFormData);
        setFormErrors(newFormErrors);
    };

    const removeField = (id, index) => {
        const fieldToRemove = formFields.find(field => field.id === id);
        const updatedFields = formFields.filter(field => field.id !== id);
        const updatedFormData = { ...formData };
        delete updatedFormData[id];
        const updatedFormErrors = { ...formErrors };
        delete updatedFormErrors[id];
        setFormFields(updatedFields);
        setFormData(updatedFormData);
        setFormErrors(updatedFormErrors);
        setRemovedFields([...removedFields, fieldToRemove]);
    };

    const handleInputChange = (id, value) => {
        setFormData({ ...formData, [id]: value });
        if (formErrors[id]) {
            setFormErrors({ ...formErrors, [id]: '' });
        }
    };

    const handleCheckboxChange = (id, checked) => {
        setFormData({ ...formData, [id]: checked });
        if (!checked) {
            setFormData({ ...formData, file: null });
        }
        if (formErrors[id]) {
            setFormErrors({ ...formErrors, [id]: '' });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let errors = {};
        formFields.forEach(field => {
            if (field.required && !formData[field.id]) {
                errors[field.id] = '* This field is required.';
            }
            if (formData[field.id] && formData[field.id].length < field.minLength) {
                errors[field.id] = `* ${field.placeholder} must be at least ${field.minLength} characters.`;
            }
            if (formData[field.id] && formData[field.id].length > field.maxLength) {
                errors[field.id] = `* ${field.placeholder} must be less than ${field.maxLength} characters.`;
            }
            if (formData[field.id] && field.format && !(field.format instanceof RegExp)) {
                errors[field.id] = `* Invalid format for ${field.placeholder}.`;
            }
            if (formData[field.id] && field.format && (field.format instanceof RegExp) && !field.format.test(formData[field.id])) {
                errors[field.id] = `* Invalid format for ${field.placeholder}.`;
            }
        });
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            const formattedFormData = {};
            formFields.forEach(field => {
                formattedFormData[field.placeholder] = formData[field.id];
            });
            console.log('Form submitted:', formattedFormData);
            const updatedSubmittedForms = [...submittedForms, formattedFormData];
            setSubmittedForms(updatedSubmittedForms);
            saveFormDataToLocalStorage({
                formFields,
                formData,
                formErrors,
                removedFields,
                submittedForms: updatedSubmittedForms
            });
        }
    };

    const handleFileUpload = (id, file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setFormErrors({ ...formErrors, [id]: `* Invalid file type. Only ${allowedTypes.join(', ')} are allowed.` });
            return;
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setFormErrors({ ...formErrors, [id]: `* File size exceeds the limit of 5MB.` });
            return;
        }
        setFormData({ ...formData, [id]: file });
        if (formErrors[id]) {
            setFormErrors({ ...formErrors, [id]: '' });
        }
        setFormData({ ...formData, fileUpload: true });
    };

    const handleLoadDataClick = () => {
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            const parsedData = JSON.parse(savedFormData);
            setFormData(parsedData.formData);
            setFormErrors({});
        }
    };

    const toggleSubmittedForms = () => {
        setShowSubmittedForms(!showSubmittedForms);
    };

    const handleAddBackField = (field) => {
        const updatedRemovedFields = removedFields.filter(f => f.id !== field.id);
        setRemovedFields(updatedRemovedFields);
        setFormFields(prevFields => {
            const newFields = [...prevFields];
            newFields.push(field);
            return newFields;
        });
    };

    const removeAllFields = () => {
        setFormFields([]);
        setFormData({});
        setFormErrors({});
        setRemovedFields([]);
        localStorage.removeItem('formData');
    };

    return (
        <div>
            <h2 className='heading'>Dynamic Form Generator</h2>
            <button className='heading-buttons' onClick={() => addFields([
                { type: 'text', placeholder: 'Name', required: true },
                { type: 'text', placeholder: 'Email', required: true, format: /^\S+@\S+\.\S+$/ },
                { type: 'number', placeholder: 'Phone Number', required: true, minLength: 10, maxLength: 10 },
                { type: 'dropdown', placeholder: 'Dropdown Field', required: true },
                { type: 'file', placeholder: 'Upload File' }
            ])}>
                Add New Member Details
            </button>
            <button className='heading-buttons' onClick={handleLoadDataClick}>Load Saved Data</button>
            <button className='heading-buttons' onClick={removeAllFields}>Remove All Fields</button>
            <button className='heading-buttons' onClick={toggleSubmittedForms}>
                {showSubmittedForms ? 'Hide Submitted Forms' : 'Check Previously Submitted Response'}
            </button>
            <form onSubmit={handleFormSubmit}>
                {formFields.map((field, index) => (
                    <div key={field.id}>
                        <FormField
                            field={field}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleCheckboxChange={handleCheckboxChange}
                            handleFileUpload={handleFileUpload}
                            formErrors={formErrors}
                        />
                        <FormError error={formErrors[field.id]} />
                        <button type="button" onClick={() => removeField(field.id, index)}>Remove</button>
                    </div>
                ))}
                {removedFields.map((field) => (
                    <RemovedField key={field.id} field={field} handleAddBackField={handleAddBackField} />
                ))}
                <button type="submit">Save</button>
            </form>
            {showSubmittedForms && (
                <div>
                    <div className='submissions'> Check Previously submitted Form (JSON)</div>
                    {submittedForms.map((form, index) => (
                        <div key={index}>
                            <h3 className='submissions-heading'>Most Recent Form Submission {index + 1} </h3>
                            <pre>{JSON.stringify(form, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormGenerator;
