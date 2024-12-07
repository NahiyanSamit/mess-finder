import React, { useState, useEffect } from "react";

const RegisterModal = ({ closeModal }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("user"); // default to 'user'
    const [phone, setPhone] = useState(""); // state for phone number
    const [phoneValid, setPhoneValid] = useState(true); // Track phone validation

    // Close modal if clicked outside
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("fixed")) {
            closeModal();
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);

        // Regex for validating phone number (Bangladesh)
        const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
        setPhoneValid(phoneRegex.test(value)); // Update validity based on the regex
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [handleOutsideClick]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (userType === "messManager" && !phoneValid) {
            alert("Please enter a valid phone number.");
            return;
        }

        console.log("Register Submitted:", {
            username,
            email,
            password,
            userType,
            phone,
        });
        closeModal(); // Close the modal after submitting
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-80 max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    {/* Username input */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Email input */}
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

                    {/* Password input */}
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

                    {/* User type select */}
                    <div className="mb-4">
                        <label
                            htmlFor="userType"
                            className="block text-sm font-medium"
                        >
                            Register As
                        </label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="user">User</option>
                            <option value="messManager">Mess Manager</option>
                        </select>
                    </div>

                    {/* Conditionally render phone number field when user selects 'Mess Manager' */}
                    {userType === "messManager" && (
                        <div className="mb-4">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium"
                            >
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="text"
                                value={phone}
                                onChange={handlePhoneChange}
                                className={`w-full p-2 border ${
                                    phoneValid
                                        ? "border-gray-300"
                                        : "border-red-500"
                                } rounded-md`}
                                placeholder="Enter your phone number"
                                required
                            />
                            {!phoneValid && phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    Please enter a valid phone number.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit and close buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                        >
                            Register
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

export default RegisterModal;
