import React, { useState } from "react";
import PropTypes from "prop-types";

export function CreateVacancyModal({
    messName,
    messType,
    address,
    upazila,
    district,
    totalOccupants,
    messManagerEmail,
    onClose, // Close function passed as a prop
    onCreateVacancy,
    onDelete, // Delete function passed as a prop
}) {
    const [price, setPrice] = useState(0);

    // handleSubmit function only runs once after form submission
    const handleSubmit = () => {
        const vacancyData = {
            messName,
            messType,
            address,
            upazila,
            district,
            totalOccupants,
            messManagerEmail,
            price,
        };

        onCreateVacancy(vacancyData); // Call to create vacancy
        onClose(); // Close modal only after submission
    };

    // handleDelete function to delete the vacancy
    const handleDelete = () => {
        const vacancyData = {
            messName,
            messType,
            address,
            upazila,
            district,
            totalOccupants,
            messManagerEmail,
            price,
        };

        onDelete(vacancyData); // Call to delete vacancy
        onClose(); // Close modal after deleting
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create Vacancy</h2>
                <div className="mb-4">
                    <p>
                        <strong>Mess Name:</strong> {messName}
                    </p>
                    <p>
                        <strong>Mess Type:</strong> {messType}
                    </p>
                    <p>
                        <strong>Address:</strong> {address}, {upazila}, {district}
                    </p>
                    <p>
                        <strong>Total Occupants:</strong> {totalOccupants}
                    </p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                        Price per Occupant:
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2"
                        placeholder="Enter price"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose} // Close the modal when cancel is clicked
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit} // Submit and close modal only after submitting
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Create Vacancy
                    </button>
                    <button
                        onClick={handleDelete} // Delete and close modal after deletion
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Delete Vacancy
                    </button>
                </div>
            </div>
        </div>
    );
}

CreateVacancyModal.propTypes = {
    messName: PropTypes.string.isRequired,
    messType: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    upazila: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    totalOccupants: PropTypes.number.isRequired,
    messManagerEmail: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired, // onClose should be passed from parent
    onCreateVacancy: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired, // onDelete should be passed from parent
};

export default CreateVacancyModal;
