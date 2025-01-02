import Dropdown from "../components/Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import React, { useState } from "react";
import districts from "../components/districts.json";
import upazilas from "../components/upazilas.json";

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchResults = location.state?.vacancies || []; // Retrieve passed vacancies

    // State for filters
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Filter search results based on user input
    const filterSearch = () => {
        const filteredResults = searchResults.filter((mess) => {
            const matchesGender = selectedGender
                ? mess.messType === selectedGender
                : true;
            const matchesRoomType = selectedRoomType
                ? getRoomType(mess.totalOccupants) === selectedRoomType
                : true;
            const matchesPrice =
                (minPrice ? mess.price >= parseFloat(minPrice) : true) &&
                (maxPrice ? mess.price <= parseFloat(maxPrice) : true);

            return matchesGender && matchesRoomType && matchesPrice;
        });

        return filteredResults;
    };

    const messDetails = (mess) => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            navigate(`/Mess/${mess._id}`, { state: { mess } });
            console.log(mess);
        } else {
            alert("Please login to view mess details");
        }
    };

    const getMessLocation = (mess) => {
        return `${mess.address}, ${getUpazilaName(
            mess.upazila
        )}, ${getDistrictName(mess.district)}`;
    };

    const getDistrictName = (districtId) => {
        const district = districts.find((d) => d.id === districtId);
        return district ? district.name : "Unknown District";
    };
    const getUpazilaName = (upazilaId) => {
        const upazila = upazilas.find((u) => u.id === upazilaId);
        return upazila ? upazila.name : "Unknown Upazila";
    };
    const getRoomType = (totalOccupants) => {
        return totalOccupants === 1 ? "Single" : "Shared";
    };

    const filteredResults = filterSearch();

    return (
        <div className="App">
            {/* Header */}
            <Header />

            {/* Dropdown below the header */}
            <div className="mt-20">
                <Dropdown />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                {/* Parent container for the filter and results */}
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
                    {/* Left Filter Section */}
                    <div className="bg-white p-4 border rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">
                            Filter Options
                        </h3>

                        {/* Gender select option */}
                        <div className="mb-4">
                            <label
                                htmlFor="gender"
                                className="block text-gray-600 mb-2"
                            >
                                Select Gender:
                            </label>
                            <select
                                id="gender"
                                value={selectedGender}
                                onChange={(e) =>
                                    setSelectedGender(e.target.value)
                                }
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        {/* Room type select option */}
                        <div className="mb-4">
                            <label
                                htmlFor="roomType"
                                className="block text-gray-600 mb-2"
                            >
                                Select Room Type:
                            </label>
                            <select
                                id="roomType"
                                value={selectedRoomType}
                                onChange={(e) =>
                                    setSelectedRoomType(e.target.value)
                                }
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Room Type --</option>
                                <option value="Single">Single</option>
                                <option value="Shared">Shared</option>
                            </select>
                        </div>

                        {/* Price range inputs */}
                        <div className="mb-4">
                            <label
                                htmlFor="price"
                                className="block text-gray-600 mb-2"
                            >
                                Select Price Range:
                            </label>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={filterSearch}
                            className="w-full py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>

                    {/* Right Search Results Section */}
                    <div className="p-4">
                        {filteredResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {filteredResults.map((mess) => (
                                    <div
                                        key={mess._id}
                                        className="p-4 border rounded-lg shadow-md"
                                    >
                                        <h2 className="text-xl font-bold mb-2">
                                            {mess.messName}
                                        </h2>
                                        <p className="text-gray-700">
                                            <span className="underline">
                                                Address:
                                            </span>{" "}
                                            {getMessLocation(mess)}
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            <span className="underline">
                                                Price:
                                            </span>{" "}
                                            {mess.price}
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            <span className="underline">
                                                Mess Type:
                                            </span>{" "}
                                            {mess.messType}
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            <span className="underline">
                                                Room Type:
                                            </span>{" "}
                                            {getRoomType(mess.totalOccupants)}
                                        </p>

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                onClick={() =>
                                                    messDetails(mess)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mt-6">
                                No results found. Please refine your search.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Search };
