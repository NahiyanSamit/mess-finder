import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import districts from "../components/districts.json";
import upazilas from "../components/upazilas.json";
import { MessDetails } from "../components/MessDetails";
import { VacancyDetails } from "../components/VacancyDetails";
import { AddPerson } from "../components/addPerson";
import CreateVacancyModal from "../components/CreateVacancyModal";
import EditProfileModal from "../components/EditProfileModal";
import EditMessModal from "../components/EditMessModal";
import BookingManagement from "../components/BookingManagement";
import UserBookings from "../components/UserBookings";
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
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showEditMess, setShowEditMess] = useState(false);

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
                console.log('Fetching vacancies for:', emailFromStorage);
                const response = await API.get(
                    `http://localhost:5000/api/vacancyroute/mess/${emailFromStorage}`
                );
                console.log('Vacancy response:', response.data);
                if (response.data.success) {
                    if (Array.isArray(response.data.vacancie)) {
                        setVacancies(response.data.vacancie);
                        console.log('Vacancies set:', response.data.vacancie);
                    } else {
                        console.log('No vacancies found or invalid data format');
                        setVacancies([]);
                    }
                } else {
                    console.log('API call successful but no data:', response.data);
                    setVacancies([]);
                }
            } catch (error) {
                console.error('Error fetching vacancies:', error);
                setVacancies([]);
            }
        };

        if (emailFromStorage) {
            fetchMessData();
            fetchOccupantData();
            fetchVacancyData();
        }
    }, [emailFromStorage]);

    const DeleteVacancy = (id) => async () => {
        try {
            const response = await API.delete(
                `http://localhost:5000/api/vacancyroute/delete/${id}`
            );
            if (response.data.success) {
                alert("Vacancy deleted successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting vacancy:", error);
            alert("An error occurred. Please try again.");
        }
        window.location.reload();
    };

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

    // Add a function to handle mess updates
    const handleMessUpdate = async (updatedMess) => {
        try {
            // Update mess data in state
            setMessData(updatedMess);
            
            // Fetch updated vacancies
            const response = await API.get(
                `http://localhost:5000/api/vacancyroute/mess/${emailFromStorage}`
            );
            if (response.data.success && response.data.vacancie) {
                setVacancies(response.data.vacancie);
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Profile Information
                            </h2>
                            <button
                                onClick={() => setShowEditProfile(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Edit Profile
                            </button>
                        </div>
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
                {/* Show mess details and vacancies for mess managers */}
                {userTypeFromStorage === "messManager" ? (
                    <div className="flex flex-col gap-6">
                        {/* First Row - Mess Details */}
                        {messData && (
                            <div className="w-full mess-details bg-gray-100 p-4 rounded-lg mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-700">
                                        Your Mess Details
                                    </h2>
                                    <button
                                        onClick={() => setShowEditMess(true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Edit Mess
                                    </button>
                                </div>
                                <p className="text-gray-600">
                                    <strong className="text-gray-800">Name:</strong>{" "}
                                    {messData.messName}
                                </p>
                                <p className="text-gray-600">
                                    <strong className="text-gray-800">Location:</strong>{" "}
                                    {messData.address},{" "}
                                    {getUpazilaName(messData.upazila)},{" "}
                                    {getDistrictName(messData.district)}
                                </p>
                                <p className="text-gray-600">
                                    <strong className="text-gray-800">Mess Type:</strong>{" "}
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

                        {/* Second Row - Vacancies and Booking Management side by side */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Vacancies Section */}
                            <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Vacancies</h3>
                                {vacancies && vacancies.length > 0 ? (
                                    <div className="space-y-3">
                                        {vacancies.map((vacancy) => (
                                            <div key={vacancy._id} className="bg-white p-3 rounded-lg shadow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p><strong>Room Type:</strong> {vacancy.totalOccupants === 1 ? 'Single' : `Shared (${vacancy.totalOccupants} Person)`}</p>
                                                        <p><strong>Price:</strong> ৳{vacancy.price}</p>
                                                    </div>
                                                    <button
                                                        onClick={DeleteVacancy(vacancy._id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No vacancies available</p>
                                )}
                            </div>

                            {/* Booking Management Section */}
                            <div className="w-full md:w-1/2">
                                <BookingManagement messManagerEmail={emailFromStorage} />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Show bookings for regular users
                    <div className="w-full">
                        <UserBookings userEmail={emailFromStorage} />
                    </div>
                )}
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
            {showEditProfile && (
                <EditProfileModal
                    closeModal={() => setShowEditProfile(false)}
                    currentUser={{
                        username: usernameFromStorage,
                        email: emailFromStorage,
                        userType: userTypeFromStorage
                    }}
                />
            )}
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
            {showEditMess && (
                <EditMessModal
                    closeModal={() => setShowEditMess(false)}
                    messData={messData}
                    onUpdate={handleMessUpdate}
                />
            )}
        </div>
    );
}

export default Profile;
