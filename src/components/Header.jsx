import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const toggleLogin = () => setShowLogin(!showLogin);
    const toggleRegister = () => setShowRegister(!showRegister);
    return (
        <>
            <header className="App-header flex items-center justify-between fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10">
                <div className="flex items-center">
                    <Link
                        to="/Home"
                        className="text-3xl font-bold text-gray-800 hover:text-blue-500"
                    >
                        Mess Finder
                    </Link>
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
            {/* Login Modal */}
            {showLogin && <LoginModal closeModal={toggleLogin} />}

            {/* Register Modal */}
            {showRegister && <RegisterModal closeModal={toggleRegister} />}
        </>
    );
};

export default Header;
