
import './App.css';
import Dropdown from "./dropdown";
import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
  
    const toggleLogin = () => setShowLogin(!showLogin);
    const toggleRegister = () => setShowRegister(!showRegister);
    return (
        <div className="App">
            <header className="App-header flex items-center justify-between fixed w-full p-4">
                <h1 className="text-3xl font-bold">Mess Finder</h1>
                <div className="flex space-x-4">
                    <button onClick={toggleLogin} className="hover:text-blue-200">Login</button>
                    <button onClick={toggleRegister} className="hover:text-blue-200">Register</button>
                </div>
            </header>
            {/* Login Modal */}
            {showLogin && <LoginModal closeModal={toggleLogin} />}

            {/* Register Modal */}
            {showRegister && <RegisterModal closeModal={toggleRegister} />}
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Dropdown />
            </div>
        </div>
    );
}

export default App;
