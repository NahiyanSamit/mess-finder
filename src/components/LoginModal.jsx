import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Import the API utility

const LoginModal = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // To display error messages
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("fixed")) {
            closeModal();
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [handleOutsideClick]);
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await API.post("http://localhost:5000/api/login", {
                email,
                password,
            });
    
            if (response.data.success) {
                console.log("Login Successful:", response.data.user);
                closeModal(); // Close the modal
                navigate("/profile"); // Redirect to the profile page
            } else {
                setErrorMessage(response.data.message); // Display error message
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred during login. Please try again.");
        }
    };
    
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-80">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                        >
                            Login
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

export default LoginModal;
