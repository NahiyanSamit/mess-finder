import React, { useState, useEffect } from "react";
import districts from "./districts.json";
import upazilas from "./upazilas.json";
import API from "../api/api";

const EditMessModal = ({ closeModal, messData, onUpdate }) => {
    const [messName, setMessName] = useState(messData.messName);
    const [address, setAddress] = useState(messData.address);
    const [messType, setMessType] = useState(messData.messType);
    const [selectedDistrict, setSelectedDistrict] = useState(messData.district);
    const [selectedUpazila, setSelectedUpazila] = useState(messData.upazila);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (selectedDistrict) {
            const filtered = upazilas.filter(
                (sub) => sub.district_id === selectedDistrict
            );
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrict]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await API.put(
                `http://localhost:5000/api/messroute/update/${messData._id}`,
                {
                    messName,
                    address,
                    messType,
                    district: selectedDistrict,
                    upazila: selectedUpazila,
                }
            );

            if (response.data.success) {
                setSuccessMessage("Mess and vacancy details updated successfully");
                if (onUpdate) {
                    onUpdate(response.data.mess);
                }
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setErrorMessage(response.data.message || "Failed to update mess details");
            }
        } catch (error) {
            console.error("Error updating mess:", error);
            setErrorMessage("An error occurred while updating mess details");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Mess Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Mess Name</label>
                        <input
                            type="text"
                            value={messName}
                            onChange={(e) => setMessName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Mess Type</label>
                        <select
                            value={messType}
                            onChange={(e) => setMessType(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Mess Type</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">District</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select District</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Upazila</label>
                        <select
                            value={selectedUpazila}
                            onChange={(e) => setSelectedUpazila(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={upazila.id}>
                                    {upazila.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMessModal; 