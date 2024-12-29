import React, { useState, useEffect } from "react";
import districts from "./districts.json";
import upazilas from "./upazilas.json";
import API from "../api/api";
import { AddPerson } from "./addPerson";
import { useLocation } from "react-router-dom";

const MessDetails = ({ closeModal }) => {
    const [messName, setMessName] = useState("");
    const [address, setAddress] = useState("");
    const [messType, setMessType] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const location = useLocation();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const email = location.state?.email || storedUser?.email;

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

    const addRoom = () => {
        setRooms([...rooms, { id: rooms.length + 1, people: [] }]);
    };

    // const openPersonDetailsForm = (roomId) => {
    //     setSelectedRoom(roomId);
    // };

    const addPersonToRoom = (personDetails) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === selectedRoom
                    ? { ...room, people: [...room.people, personDetails] }
                    : room
            )
        );
        setSelectedRoom(null); // Close the AddPerson modal
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rooms.length === 0) {
            alert("Please add at least one room.");
            return;
        }

        const roomsWithoutOccupants = rooms.filter(
            (room) => room.people.length === 0
        );
        if (roomsWithoutOccupants.length > 0) {
            alert("Each room must have at least one occupant.");
            return;
        }
        const managerEmail = email;
        const upazila = selectedUpazila;
        const district = selectedDistrict;
        const totalRooms = rooms.length;

        try {
            const response = await API.post("http://localhost:5000/api/messroute/add", {
                managerEmail,
                messName,
                messType,
                address,
                upazila,
                district,
                totalRooms,
            });

            if (response.data.success) {
                alert("Mess details added successfully!");
                closeModal();
            } else {
                console.log("Failed to add mess details. Please try again.");
                closeModal();
            }
        } catch (error) {
            console.error("Error adding mess details:", error);
            alert("An error occurred. Please try again.");
            closeModal();
        }
        closeModal();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-80 max-w-md">
                <h2 className="text-2xl font-semibold mb-4">
                    Add Mess Details
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="messName" className="block text-sm font-medium">
                            Mess Name
                        </label>
                        <input
                            id="messName"
                            type="text"
                            value={messName}
                            onChange={(e) => setMessName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter mess name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="messType" className="block text-sm font-medium">
                            Mess Type
                        </label>
                        <select
                            id="messType"
                            value={messType}
                            onChange={(e) => setMessType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">-- Select Gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium">
                            Address
                        </label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="district" className="block text-sm font-medium">
                            District
                        </label>
                        <select
                            id="district"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">-- Select District --</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="upazila" className="block text-sm font-medium">
                            Upazila
                        </label>
                        <select
                            id="upazila"
                            value={selectedUpazila}
                            onChange={(e) => setSelectedUpazila(e.target.value)}
                            disabled={!selectedDistrict}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">-- Select Upazila --</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={upazila.id}>
                                    {upazila.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={addRoom}
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 mb-2"
                        >
                            Add Room
                        </button>
                        <ul>
                            {rooms.map((room) => (
                                <li key={room.id} className="mb-2">
                                    Room {room.id}{" "}
                                    {/* <button
                                        type="button"
                                        onClick={() => openPersonDetailsForm(room.id)}
                                        className="text-blue-500 underline"
                                    >
                                        Add Person
                                    </button>
                                    <ul>
                                        {room.people.map((person, index) => (
                                            <li key={index}>
                                                {person.name} (Age: {person.age}, Phone: {person.phone})
                                            </li>
                                        ))}
                                    </ul> */}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Save
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
                {selectedRoom && (
                    <AddPerson
                        roomId={selectedRoom}
                        onAddPerson={addPersonToRoom}
                        onCancel={() => setSelectedRoom(null)}
                    />
                )}
            </div>
        </div>
    );
};

export { MessDetails };
