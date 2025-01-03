import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import districts from "../components/districts.json";
import upazilas from "../components/upazilas.json";
import { MessDetails } from "../components/MessDetails";
import { VacancyDetails } from "../components/VacancyDetails";
import { AddPerson } from "../components/addPerson";
import CreateVacancyModal from "../components/CreateVacancyModal";
import { Link } from "react-router-dom";
import API from "../api/api";

export function Profile() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showMessDetails, setMessDetails] = useState(false);
    const [showVacancyDetails, setVacancyDetails] = useState(false);
    const [hasMess, setHasMess] = useState(false);
    const [messData, setMessData] = useState(null); // State to store mess data
    const [occupantsData, setOccupantsData] = useState(null);
    const [vacancies, setVacancies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null); // State to store the selected room
    const [showVacancyModal, setShowVacancyModal] = useState(false);
    const [vacancyRoomDetails, setVacancyRoomDetails] = useState(null);
    const [occupantId, setOccupantId] = useState(null);

    // Retrieve user data from location state
    const { username, email, userType } = location.state || {};

    // Fallback to localStorage if state is unavailable
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const usernameFromStorage = username || storedUser?.username;
    const emailFromStorage = email || storedUser?.email;
    const userTypeFromStorage = userType || storedUser?.userType;

    const getDistrictName = (districtId) => {
        const district = districts.find((d) => d.id === districtId);
        return district ? district.name : "Unknown District";
    };
    const getUpazilaName = (upazilaId) => {
        const upazila = upazilas.find((u) => u.id === upazilaId);
        return upazila ? upazila.name : "Unknown Upazila";
    };

    const openPersonDetailsForm = (roomId) => {
        setSelectedRoom(roomId); // Set the selected room to display the form
    };

    useEffect(() => {
        // Check if the user has a mess in the database
        const fetchMessData = async () => {
            try {
                const response = await API.get(
                    `http://localhost:5000/api/messroute/user/${emailFromStorage}`
                );
                if (response.data.success && response.data.mess) {
                    setHasMess(true);
                    setMessData(response.data.mess); // Store mess data
                    console.log("Mess data:", response.data.mess);
                }
            } catch (error) {
                console.error("Error fetching mess data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch Occupant data
        const fetchOccupantData = async () => {
            try {
                const response = await API.get(
                    `http://localhost:5000/api/occupantroute/room/${emailFromStorage}`
                );
                if (response.data.success && response.data.occupant) {
                    setOccupantsData(response.data.occupant);
                    console.log("Occupants data:", response.data.occupant);
                }
            } catch (error) {
                console.error("Error fetching occupants:", error);
            }
        };

        // Fetch Vacancy data
        const fetchVacancyData = async () => {
            try {
                const response = await API.get(
                    `http://localhost:5000/api/vacancyroute/mess/${emailFromStorage}`
                );
                if (response.data.success && response.data.vacancie) {
                    setVacancies(response.data.vacancie);
                    console.log("API Response:", response.data.vacancie);
                    console.log("Hello");
                } else {
                    console.log("API Response:", response.data.vacancie);
                    setVacancies(response.data.vacancie);
                }
            } catch (error) {
                console.log("Error fetching vacancies:");
            }
        };

        if (emailFromStorage) {
            fetchMessData();
            fetchOccupantData();
            fetchVacancyData();
        }
    }, [emailFromStorage]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const addVacancyDetails = () => setVacancyDetails(!showVacancyDetails);

    const addMessDetails = () => setMessDetails(!showMessDetails);

    const addPersonToRoom = (personData) => {
        if (!messData || !messData.rooms || selectedRoom == null) {
            console.error("Mess data or room not found");
            return;
        }

        const room = messData.rooms[selectedRoom - 1];
        if (!room) {
            console.error("Selected room not found");
            return;
        }

        // Ensure room.people exists before pushing new person data
        if (!room.people) {
            room.people = []; // Initialize people array if it doesn't exist
        }

        room.people.push(personData); // Add the new person to the room
        setMessData({ ...messData }); // Update the mess data in state
        setSelectedRoom(null); // Close the form after adding the person
    };
    const toggleVacancyModal = (roomNo, _id) => () => {
        const totalSeats = occupantsData.filter(
            (occupant) => occupant.roomNo === roomNo
        ).length;
        setOccupantId(_id);
        setVacancyRoomDetails(totalSeats);
        setShowVacancyModal((prev) => !prev);
    };

    return (
        <div className="relative flex flex-col">
            <div className="absolute top-4 left-4">
                <Link
                    to="/"
                    className="text-3xl font-bold text-gray-800 hover:text-blue-500"
                >
                    Mess Finder
                </Link>
            </div>
            <div className="profile-page max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <div className="profile-header flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome, {usernameFromStorage}!
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="logout-btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
                <div className="profile-details">
                    <div className="profile-info bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Profile Information
                        </h2>
                        <p className="text-gray-600 mb-2">
                            <strong className="text-gray-800">Email:</strong>{" "}
                            {emailFromStorage}
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-gray-800">Bio:</strong>{" "}
                            {userTypeFromStorage}
                        </p>
                    </div>
                </div>
                {userTypeFromStorage === "messManager" && (
                    <div className="flex justify-center mt-4">
                        {!loading && !hasMess && (
                            <button
                                onClick={addMessDetails}
                                className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Add Mess
                            </button>
                        )}
                        {!loading && !hasMess && (
                            <button
                                onClick={addVacancyDetails}
                                className="py-2 px-4 ml-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Add Vacancy
                            </button>
                        )}
                    </div>
                )}
                <div className="details-container flex flex-col md:flex-row gap-6">
                    {messData && (
                        <div className="mess-details bg-gray-100 p-4 rounded-lg mt-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Your Mess Details
                            </h2>
                            <p className="text-gray-600">
                                <strong className="text-gray-800">Name:</strong>{" "}
                                {messData.messName}
                            </p>
                            <p className="text-gray-600">
                                <strong className="text-gray-800">
                                    Location:
                                </strong>{" "}
                                {messData.address},{" "}
                                {getUpazilaName(messData.upazila)},{" "}
                                {getDistrictName(messData.district)}
                            </p>
                            <p className="text-gray-600">
                                <strong className="text-gray-800">
                                    Mess Type:
                                </strong>{" "}
                                {messData.messType}
                            </p>
                            <div className="text-gray-600">
                                <strong className="text-gray-800">
                                    Rooms:
                                </strong>
                                <ul className="mt-2">
                                    {Array.from(
                                        { length: messData.totalRooms },
                                        (_, index) => (
                                            <li
                                                key={index}
                                                className="flex flex-col bg-gray-50 p-2 rounded mb-2"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span>
                                                        <strong>
                                                            Room {index + 1}:
                                                        </strong>{" "}
                                                        Details not available
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openPersonDetailsForm(
                                                                index + 1
                                                            )
                                                        }
                                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                                    >
                                                        Add Person
                                                    </button>
                                                </div>
                                                <ul className="pl-4 list-disc">
                                                    {occupantsData?.length >
                                                    0 ? (
                                                        occupantsData
                                                            .filter(
                                                                (occupant) =>
                                                                    occupant.roomNo ===
                                                                    index + 1
                                                            )
                                                            .map((occupant) => (
                                                                <li
                                                                    key={
                                                                        occupant._id
                                                                    }
                                                                    className="mb-1"
                                                                >
                                                                    <strong>
                                                                        Name:
                                                                    </strong>{" "}
                                                                    {
                                                                        occupant.name
                                                                    }{" "}
                                                                    <button
                                                                        type="button"
                                                                        onClick={toggleVacancyModal(
                                                                            occupant.roomNo,
                                                                            occupant._id
                                                                        )}
                                                                        className="bg-orange-500 text-white rounded hover:bg-orange-600"
                                                                    >
                                                                        Create
                                                                        Vacancy
                                                                    </button>
                                                                    <br />
                                                                    <strong>
                                                                        Age:
                                                                    </strong>{" "}
                                                                    {
                                                                        occupant.age
                                                                    }{" "}
                                                                    <br />
                                                                    <strong>
                                                                        Phone:
                                                                    </strong>{" "}
                                                                    {
                                                                        occupant.phone
                                                                    }
                                                                </li>
                                                            ))
                                                    ) : (
                                                        <li>
                                                            No occupants
                                                            available
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                    {/* show all vacancy listed by the profile */}
                    {vacancies && (
                        <div className="vacancy-details bg-gray-100 p-4 rounded-lg mt-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Your Vacancy Details
                            </h2>
                            {vacancies.map((vacancy, index) => (
                                <div
                                    key={vacancy._id}
                                    className="flex flex-col bg-gray-50 p-2 rounded mb-2"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span>
                                            <strong>
                                                Vacancy {index + 1}:
                                            </strong>{" "}
                                            {vacancy.messName}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                console.log("Delete vacancy");
                                            }}
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <ul className="pl-4 list-disc">
                                        <li className="mb-1">
                                            <strong>Name:</strong>{" "}
                                            {vacancy.messName}
                                        </li>
                                        <li className="mb-1">
                                            <strong>Address:</strong>{" "}
                                            {vacancy.address},{" "}
                                            {getUpazilaName(vacancy.upazila)},{" "}
                                            {getDistrictName(vacancy.district)}
                                        </li>
                                        <li className="mb-1">
                                            <strong>Type:</strong>{" "}
                                            {vacancy.messType}
                                        </li>
                                        <li className="mb-1">
                                            <strong>Price:</strong>{" "}
                                            {vacancy.price}
                                        </li>
                                        <li className="mb-1">
                                            <strong>Occupants:</strong>{" "}
                                            {vacancy.totalOccupants}
                                        </li>
                                    </ul>
                                </div>
                            ))} 
                        </div>
                    )}
                </div>
            </div>
            <div>
                {/* Existing Profile Content */}
                {showVacancyModal && (
                    <CreateVacancyModal
                        messName={messData.messName}
                        messType={messData.messType}
                        address={messData.address}
                        upazila={messData.upazila}
                        district={messData.district}
                        messManagerEmail={emailFromStorage}
                        occupant_id={occupantId}
                        totalOccupants={vacancyRoomDetails}
                        onClose={toggleVacancyModal()}
                        onCreateVacancy={() => {}}
                    />
                )}
            </div>
            {selectedRoom && (
                <AddPerson
                    roomId={selectedRoom}
                    onAddPerson={addPersonToRoom}
                    onCancel={() => setSelectedRoom(null)}
                />
            )}
            {/* Toggle modal */}
            {showMessDetails && <MessDetails closeModal={addMessDetails} />}
            {showVacancyDetails && (
                <VacancyDetails closeModal={addVacancyDetails} />
            )}
        </div>
    );
}

export default Profile;
