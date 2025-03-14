import React, { useState } from "react";
import API from "../api/api";

const EditProfileModal = ({ closeModal, currentUser }) => {
    const [username, setUsername] = useState(currentUser.username);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (newPassword && newPassword !== confirmPassword) {
            setErrorMessage("New passwords do not match");
            return;
        }

        try {
            const response = await API.put("http://localhost:5000/api/auth/update-profile", {
                email: currentUser.email,
                username,
                currentPassword,
                newPassword: newPassword || undefined
            });

            if (response.data.success) {
                setSuccessMessage("Profile updated successfully");
                // Update localStorage with new username
                const updatedUser = { ...currentUser, username };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setErrorMessage(response.data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorMessage("An error occurred while updating profile");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter current password to make changes"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Confirm new password"
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal; 