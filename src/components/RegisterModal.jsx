import React, { useState, useEffect } from "react";
import API from "../api/api"; // Import the API utility

const RegisterModal = ({ closeModal }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState("user"); // default to 'user'
    const [phone, setPhone] = useState(""); // state for phone number
    const [phoneValid, setPhoneValid] = useState(true); // Track phone validation
    const [paymentMethods, setPaymentMethods] = useState({
        bkash: { enabled: false, number: "" },
        nagad: { enabled: false, number: "" },
        rocket: { enabled: false, number: "" }
    });

    // Close modal if clicked outside
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("fixed")) {
            closeModal();
        }
    };
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Regex to check password criteria
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        setIsPasswordValid(passwordRegex.test(value));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);

        // Regex for validating phone number (Bangladesh)
        const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
        setPhoneValid(phoneRegex.test(value)); // Update validity based on the regex
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethods(prev => ({
            ...prev,
            [method]: {
                ...prev[method],
                enabled: !prev[method].enabled,
                number: !prev[method].enabled ? phone : ""
            }
        }));
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [handleOutsideClick]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation for password matching
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // Show loading or any other indication if necessary
        try {
            const response = await API.post(
                "http://localhost:5000/api/auth/register",
                {
                    username,
                    email,
                    password,
                    userType,
                    phone,
                    paymentMethods
                }
            );

            // Handle successful registration
            alert(response.data.message); // or any other success indication
            closeModal(); // Close the modal after submitting

            // Optionally reset the form
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPhone("");
            setUserType("user");
        } catch (error) {
            console.error("Error during registration:", error);
            alert(
                error.response
                    ? error.response.data.message
                    : "An error occurred."
            );
        }
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
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => handlePasswordChange(e)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {!isPasswordValid && (
                            <p className="text-red-500 text-sm mt-1">
                                Password must be at least 8 characters long,
                                include an uppercase letter, a number, and a
                                special character.
                            </p>
                        )}
                    </div>

                    {/* Re-enter Password input */}
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium"
                        >
                            Re-enter Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Re-enter your password"
                            required
                        />
                        {password &&
                            confirmPassword &&
                            password !== confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    Passwords do not match.
                                </p>
                            )}
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

                    {/* Payment methods */}
                    {userType === "messManager" && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Payment Methods
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="bkash"
                                        checked={paymentMethods.bkash.enabled}
                                        onChange={() => handlePaymentMethodChange('bkash')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="bkash">bKash</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="nagad"
                                        checked={paymentMethods.nagad.enabled}
                                        onChange={() => handlePaymentMethodChange('nagad')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="nagad">Nagad</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="rocket"
                                        checked={paymentMethods.rocket.enabled}
                                        onChange={() => handlePaymentMethodChange('rocket')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="rocket">Rocket</label>
                                </div>
                            </div>
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
