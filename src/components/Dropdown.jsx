import React, { useState, useEffect } from "react";
import districts from "./districts.json";
import upazilas from "./upazilas.json";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Dropdown = () => {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const navigate = useNavigate();

    const handleSearch = () => {
        // get vacancy data from database
        API.get(
            `http://localhost:5000/api/vacancyroute/get/${selectedDistrict}/${selectedUpazila}`
        ).then((response) => {
            if (response.status === 200) {
                navigate("/search", { state: { vacancies: response.data } });
                console.log(response.data);
            }
        });
    };

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

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            <div>
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
                <select
                    id="upazila"
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
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
                        <option disabled>No Upazilas Available</option>
                    )}
                </select>
            </div>

            <button
                type="button"
                onClick={handleSearch}
                disabled={!selectedDistrict || !selectedUpazila} // Disable if either is not selected
                className="py-1.5 px-4 transition-colors bg-gray-50 border active:bg-gray-200 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="fill-current text-gray-900"
                    width="24"
                    height="24"
                >
                    <path
                        fillRule="evenodd"
                        d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"
                    ></path>
                </svg>
            </button>
        </div>
    );
};
export default Dropdown;
