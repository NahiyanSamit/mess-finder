import React, { useState, useEffect } from "react";

const MessDetails = ({ closeModal }) => {
    const [messName, setMessName] = useState("");
    const [location, setLocation] = useState("");
    const [rooms, setRooms] = useState([]); // Array of rooms
    const [selectedRoom, setSelectedRoom] = useState(null); // Room ID for adding person details
    const [personDetails, setPersonDetails] = useState({
        name: "",
        age: "",
        phone: "",
    });

    // Close modal if clicked outside
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("fixed")) {
            closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const addRoom = () => {
        setRooms([...rooms, { id: rooms.length + 1, people: [] }]);
    };

    const openPersonDetailsForm = (roomId) => {
        setSelectedRoom(roomId);
    };

    const handlePersonDetailsSubmit = (e) => {
        e.preventDefault();
        setRooms(
            rooms.map((room) =>
                room.id === selectedRoom
                    ? { ...room, people: [...room.people, personDetails] }
                    : room
            )
        );
        setSelectedRoom(null); // Close the form
        setPersonDetails({ name: "", age: "", phone: "" }); // Reset the form
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Mess Details Submitted:", {
            messName,
            location,
            rooms,
        });
        closeModal();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-80 max-w-md">
                <h2 className="text-2xl font-semibold mb-4">
                    Add Mess Details
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Mess Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">
                            Mess Name
                        </label>
                        <input
                            type="text"
                            value={messName}
                            onChange={(e) => setMessName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter mess name"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter location"
                            required
                        />
                    </div>

                    {/* Rooms */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">
                            Rooms
                        </label>
                        <button
                            type="button"
                            onClick={addRoom}
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 mb-2"
                        >
                            Add Room
                        </button>
                        {/* Scrollable container for the room list */}
                        <div className="max-h-40 overflow-y-scroll border border-gray-300 rounded-md p-2">
                            <ul>
                                {rooms.map((room) => (
                                    <li key={room.id} className="mb-2">
                                        Room {room.id}{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPersonDetailsForm(room.id)
                                            }
                                            className="text-blue-500 underline"
                                        >
                                            Add Person
                                        </button>
                                        <ul className="pl-4 mt-2">
                                            {room.people.map(
                                                (person, index) => (
                                                    <li key={index}>
                                                        {person.name} (Age:{" "}
                                                        {person.age}, Phone:{" "}
                                                        {person.phone})
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                        >
                            Submit
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

                {/* Person Details Form */}
                {selectedRoom && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg w-80 max-w-md">
                            <h3 className="text-xl font-semibold mb-4">
                                Add Person to Room {selectedRoom}
                            </h3>
                            <form onSubmit={handlePersonDetailsSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={personDetails.name}
                                        onChange={(e) =>
                                            setPersonDetails({
                                                ...personDetails,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={personDetails.age}
                                        onChange={(e) =>
                                            setPersonDetails({
                                                ...personDetails,
                                                age: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={personDetails.phone}
                                        onChange={(e) =>
                                            setPersonDetails({
                                                ...personDetails,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRoom(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { MessDetails };
