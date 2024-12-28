import React, { useState } from "react";
import API from "../api/api";
import { useLocation } from "react-router-dom";

const AddPerson = ({ roomId, onAddPerson, onCancel }) => {
    const [personDetails, setPersonDetails] = useState({
        name: "",
        age: "",
        phone: "",
    });

    const location = useLocation();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const email = location.state?.email || storedUser?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!personDetails.name.trim()) {
            alert("Please enter a valid name.");
            return;
        }
        onAddPerson(personDetails); // Ensure this function is called

        const name = personDetails.name;
        const age = personDetails.age;
        const phone = personDetails.phone;
        const managerEmail = email;
        const roomNo = roomId;

        try {
            const response = await API.post(
                "http://localhost:5000/api/occupantroute/add", 
                {
                    name,
                    age,
                    phone,
                    managerEmail,
                    roomNo,
                }
            );

            if (response.data.success) {
                alert("Person added successfully");
                onCancel();
            } else {
                onCancel();
            }
        } catch (error) {
            console.error("Error adding person:", error);
            alert("An error occurred. Please try again.");
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-80 max-w-md">
                <h3 className="text-xl font-semibold mb-4">
                    Add Person to Room {roomId}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="personName"
                            className="block text-sm font-medium"
                        >
                            Name
                        </label>
                        <input
                            id="personName"
                            type="text"
                            value={personDetails.name}
                            onChange={(e) =>
                                setPersonDetails((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="personAge"
                            className="block text-sm font-medium"
                        >
                            Age
                        </label>
                        <input
                            id="personAge"
                            type="number"
                            value={personDetails.age}
                            onChange={(e) =>
                                setPersonDetails((prev) => ({
                                    ...prev,
                                    age: e.target.value,
                                }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter age"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="personPhone"
                            className="block text-sm font-medium"
                        >
                            Phone
                        </label>
                        <input
                            id="personPhone"
                            type="text"
                            value={personDetails.phone}
                            onChange={(e) =>
                                setPersonDetails((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { AddPerson };
