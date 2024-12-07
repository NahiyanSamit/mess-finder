import Dropdown from "../components/Dropdown";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

function Search() {
    // eslint-disable-next-line no-undef
    const [showLogin, setShowLogin] = useState(false);
    // eslint-disable-next-line no-undef
    const [showRegister, setShowRegister] = useState(false);

    const toggleLogin = () => setShowLogin(!showLogin);
    const toggleRegister = () => setShowRegister(!showRegister);

    const location = useLocation();
    const navigate = useNavigate();
    const searchResults = location.state?.results || []; // Retrieve passed state

    const filterSearch = () => {
        // Implement search filtering logic here
    };

    const messDetails = (mess) => {
        navigate(`/Mess/${mess.id}`, { state: { mess } });
    };

    return (
        <div className="App">
            {/* Header */}
            <header className="App-header flex items-center justify-between fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10">
                <div className="flex items-center">
                    <a
                        href="/"
                        className="text-3xl font-bold text-gray-800 hover:text-blue-500"
                    >
                        Mess Finder
                    </a>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={toggleLogin}
                        className="text-gray-800 hover:text-blue-500 px-4 py-2 rounded-md transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={toggleRegister}
                        className="text-gray-800 hover:text-blue-500 px-4 py-2 rounded-md transition-colors"
                    >
                        Register
                    </button>
                </div>
            </header>

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
                        {/* gender select option */}
                        <div className="mb-4">
                            <label
                                htmlFor="gender"
                                className="block text-gray-600 mb-2"
                            >
                                Select Gender:
                            </label>
                            <select
                                id="gender"
                                // value={selectedGender}
                                // onChange={(e) =>
                                //     setSelectedGender(e.target.value)
                                // }
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        {/* mess type select option */}
                        <div className="mb-4">
                            <label
                                htmlFor="messType"
                                className="block text-gray-600 mb-2"
                            >
                                Select Room Type:
                            </label>
                            <select
                                id="gender"
                                // value={selectedGender}
                                // onChange={(e) =>
                                //     setSelectedGender(e.target.value)
                                // }
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Room Type --</option>
                                <option value="male">Single</option>
                                <option value="female">Shared</option>
                            </select>
                        </div>
                        {/* Seat price range */}
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
                                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
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
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {searchResults.map((mess) => (
                                    <div
                                        key={mess.id}
                                        className="p-4 border rounded-lg shadow-md"
                                    >
                                        <h2 className="text-xl font-bold mb-2">
                                            {mess.name}
                                        </h2>
                                        <p className="text-gray-700">
                                            {mess.location}
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            {mess.details}
                                        </p>
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-blue-500 font-bold">
                                                {mess.price}
                                            </p>
                                            <button
                                                className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                onClick={() =>
                                                    messDetails(mess)
                                                } // Correct invocation
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

            {/* Login Modal */}
            {showLogin && <LoginModal closeModal={toggleLogin} />}

            {/* Register Modal */}
            {showRegister && <RegisterModal closeModal={toggleRegister} />}
        </div>
    );
}

export { Search };
