import Dropdown from "../components/Dropdown";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
    const searchResults = location.state?.results || []; // Retrieve passed state


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
                                <p className="text-gray-700">{mess.location}</p>
                                <p className="text-gray-600 mt-2">
                                    {mess.details}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-6">
                        No results found. Please refine your search.
                    </p>
                )}
            </div>

            {/* Login Modal */}
            {showLogin && <LoginModal closeModal={toggleLogin} />}

            {/* Register Modal */}
            {showRegister && <RegisterModal closeModal={toggleRegister} />}
        </div>
    );
}

export { Search };
