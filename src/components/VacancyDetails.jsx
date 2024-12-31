import React, { useState, useEffect } from "react";
import districts from "./districts.json";
import upazilas from "./upazilas.json";
import API from "../api/api";
import { useLocation } from "react-router-dom";

const VacancyDetails = ({ closeModal }) => {
    const [messName, setMessName] = useState("");
    const [address, setAddress] = useState("");
    const [messType, setMessType] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [totalOccupants, settotalOccupants] = useState("");
    const [price, setPrice] = useState("");

    const location = useLocation();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const messManagerEmail = location.state?.email || storedUser?.email;

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

    const handleSubmit = () => {
        const vacancyData = {
            messName,
            messType,
            address,
            upazila: selectedUpazila,
            district: selectedDistrict,
            totalOccupants,
            messManagerEmail,
            price,
        };

        try {
            API.post("http://localhost:5000/api/vacancyroute/add", vacancyData).then((response) => {
                if (response.status === 201) {
                    alert("Vacancy added successfully");
                    closeModal();
                }
            });
        } catch (error) {
            alert("Error saving vacancy");
        }

    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-80 max-w-md">
                <h2 className="text-2xl font-semibold mb-4">
                    Add Vacency Details
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="messName" className="block text-sm font-medium">
                            Mess Name
                        </label>
                        <input
                            id="messName"
                            type="text"
                            value={messName}
                            onChange={(e) => setMessName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter mess name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="messType" className="block text-sm font-medium">
                            Mess Type
                        </label>
                        <select
                            id="messType"
                            value={messType}
                            onChange={(e) => setMessType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">-- Select Gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium">
                            Address
                        </label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="district" className="block text-sm font-medium">
                            District
                        </label>
                        <select
                            id="district"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">-- Select District --</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="upazila" className="block text-sm font-medium">
                            Upazila
                        </label>
                        <select
                            id="upazila"
                            value={selectedUpazila}
                            onChange={(e) => setSelectedUpazila(e.target.value)}
                            disabled={!selectedDistrict}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">-- Select Upazila --</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={upazila.id}>
                                    {upazila.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* div for total room occupants in number */}
                    <div className="mb-4">
                        <label htmlFor="totalOccupants" className="block text-sm font-medium">
                            Room Occupant
                        </label>
                        <input
                            id="totalOccupants"
                            type="number"
                            value={totalOccupants}
                            onChange={(e) => settotalOccupants(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter total room occupants"
                            required
                        />
                    </div>
                    {/* div for price */}
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium">
                            Price
                        </label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    
                    
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );


};

export { VacancyDetails };