import React, { useState, useEffect } from "react";
import districts from "./districts.json";
import upazilas from "./upazilas.json";
import { useNavigate } from "react-router-dom";

const mockMessData = [
    {
        id: 1,
        name: "Mess A",
        district: "Comilla",
        dist_id: "1",
        upazila: "Barura",
        upazila_id: "2",
        details: "Affordable meals with great quality.",
    },
    {
        id: 2,
        name: "Mess B",
        district: "Comilla",
        dist_id: "1",
        upazila: "Upazila 2",
        upazila_id: "2",
        details: "Healthy food with vegetarian options.",
    },
    {
        id: 3,
        name: "Mess A",
        district: "Comilla",
        dist_id: "1",
        upazila: "Barura",
        upazila_id: "2",
        details: "Affordable meals with great quality.",
    },
    {
        id: 4,
        name: "Mess B",
        district: "Comilla",
        dist_id: "1",
        upazila: "Upazila 2",
        upazila_id: "2",
        details: "Healthy food with vegetarian options.",
    },
    {
        id: 5,
        name: "Mess A",
        district: "Comilla",
        dist_id: "1",
        upazila: "Barura",
        upazila_id: "2",
        details: "Affordable meals with great quality.",
    },
    {
        id: 6,
        name: "Mess B",
        district: "Comilla",
        dist_id: "1",
        upazila: "Upazila 2",
        upazila_id: "2",
        details: "Healthy food with vegetarian options.",
    },
    {
        id: 7,
        name: "Mess A",
        district: "Comilla",
        dist_id: "1",
        upazila: "Barura",
        upazila_id: "2",
        details: "Affordable meals with great quality.",
    },
    {
        id: 8,
        name: "Mess B",
        district: "Comilla",
        dist_id: "1",
        upazila: "Upazila 2",
        upazila_id: "2",
        details: "Healthy food with vegetarian options.",
    },
    {
        id: 9,
        name: "Mess C",
        district: "Comilla",
        dist_id: "1",
        upazila: "Upazila 3",
        upazila_id: "4",
        details: "Healthy food with vegetarian options.",
    },
];

const Dropdown = () => {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const navigate = useNavigate();

    const handleSearch = () => {
        let filteredResults = mockMessData.filter((mess) => {
            // Compare district_id and upazila_id with selected values
            const districtMatch = mess.dist_id === selectedDistrict;
            const upazilaMatch = mess.upazila_id === selectedUpazila;
            
            return districtMatch && upazilaMatch;
        });
        
        if (filteredResults.length === 0) {
            console.log("Selected District:", selectedDistrict);
            console.log("Selected Upazila:", selectedUpazila);
            console.log("Filtered Results:", filteredResults);
            // Clear the filteredResults array
            filteredResults = [];
            navigate("/search", { state: { results: filteredResults } });
        } else {
            navigate("/search", { state: { results: filteredResults } });
        }
        
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
                        fill-rule="evenodd"
                        d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"
                    ></path>
                </svg>
            </button>
        </div>
    );
};
export default Dropdown;
