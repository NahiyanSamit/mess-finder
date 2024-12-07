import React, { useState, useEffect } from "react";
import districts from "./districts.json";
import upazilas from "./upazilas.json";

const Dropdown = () => {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    useEffect(() => {
        if (selectedDistrict) {
            // Directly compare as strings
            const filtered = upazilas.filter(
                (sub) => sub.district_id === selectedDistrict
            );
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrict]);

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            <div>
                {/* <label htmlFor="district">Select District:</label> */}
                <select
                    id="district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-60 py-3 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select District --</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                {/* <label htmlFor="subdistrict">Select Upazila:</label> */}
                <select
                    id="subdistrict"
                    disabled={!selectedDistrict}
                    className="w-60 py-3 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select Upazila --</option>
                    {filteredUpazilas.length > 0 ? (
                        filteredUpazilas.map((upazilas) => (
                            <option key={upazilas.id} value={upazilas.id}>
                                {upazilas.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No Subdistricts Available</option>
                    )}
                </select>
            </div>
            <div>
                {/* <label htmlFor="gender">Select Gender:</label> */}
                <select
                    id="gender"
                    className="w-60 py-3 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select Gender --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <button class="py-1.5 px-4 transition-colors bg-gray-50 border active:bg-gray-200 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                {" "}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="fill-current text-gray-900"
                    width="24"
                    height="24"
                >
                    <path
                        fill-rule="evenodd"
                        d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"
                    ></path>
                </svg>
            </button>
        </div>
    );
};
export default Dropdown;
