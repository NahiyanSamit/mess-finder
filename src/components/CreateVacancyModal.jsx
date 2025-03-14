import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "../api/api";

export function CreateVacancyModal({
    occupant_id,
    messName,
    messType,
    address,
    upazila,
    district,
    totalOccupants,
    messManagerEmail,
    onClose, // Close function passed as a prop
    onCreateVacancy,
    onDelete, // Delete function passed as a prop
}) {
    const [price, setPrice] = useState(0);
    const [messDescription, setMessDescription] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Cleanup function to revoke object URLs when component unmounts or images change
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    // handleSubmit function only runs once after form submission
    const handleSubmit = async () => {
        try {
            // First, upload all images to Cloudinary
            const imageUrls = [];
            for (const image of images) {
                const imageFormData = new FormData();
                imageFormData.append('file', image);

                try {
                    const uploadResponse = await API.post("http://localhost:5000/api/upload/upload", imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (uploadResponse.data && uploadResponse.data.secure_url) {
                        imageUrls.push(uploadResponse.data.secure_url);
                    }
                    console.log(uploadResponse.data);
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            }

            // Now create the vacancy with image URLs
            const vacancyData = {
                messName,
                messDescription,
                messType,
                address,
                upazila,
                district,
                totalOccupants,
                messManagerEmail,
                price,
                images: imageUrls // Changed from imagesUrl to images
            };

            const response = await API.post("http://localhost:5000/api/vacancyroute/add", vacancyData);
            if (response.status === 201) {
                alert("Vacancy added successfully");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error saving vacancy");
        }

        onCreateVacancy(); // Call to create vacancy
        // Delete the occupant after creating vacancy
        try {
            API.delete(`http://localhost:5000/api/occupantroute/delete/${occupant_id}`);
            alert("Seat deleted successfully");
        } catch (error) {
            alert("Error deleting seat");
        }
        onClose(); // Close modal only after submission
        // reload the page to see the updated list of occupants
        window.location.reload();
    };

    // handleDelete function to delete the vacancy
    const handleDelete = () => {
        // delete occupant from the database using the occupant_id
        try {
            API.delete(`http://localhost:5000/api/occupantroute/delete/${occupant_id}`);
            alert("Seat deleted successfully");
            onDelete(); // Call to delete vacancy
            onClose(); // Close modal after deleting
        } catch (error) {
            alert("Error deleting seat");
        }
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create Vacancy</h2>
                <div className="mb-4">
                    <p>
                        <strong>Mess Name:</strong> {messName}
                    </p>
                    <p>
                        <strong>Mess Type:</strong> {messType}
                    </p>
                    <p>
                        <strong>Address:</strong> {address}, {upazila}, {district}
                    </p>
                    <p>
                        <strong>Total Occupants:</strong> {totalOccupants}
                    </p>

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                        Price per Seat:
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2"
                        placeholder="Enter price"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                        Mess Description:
                    </label>
                    <textarea
                        type="String"
                        id="messDescription"
                        value={messDescription}
                        onChange={(e) => setMessDescription(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2"
                        placeholder="Enter mess description"
                    />
                </div>


                {/* Add images button for multiple images */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="images">
                        Images:
                    </label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setImages(files);
                            
                            // Create preview URLs for the selected images
                            const previewUrls = files.map(file => URL.createObjectURL(file));
                            setImagePreviews(previewUrls);
                        }}
                        className="border border-gray-300 rounded w-full p-2"
                    />
                </div>
                
                {/* Image previews */}
                {imagePreviews && imagePreviews.length > 0 && (
                    <div className="mb-4">
                        <p className="text-gray-700 font-medium mb-2">Image Previews:</p>
                        <div className="grid grid-cols-3 gap-2">
                            {imagePreviews.map((url, index) => (
                                <div key={index} className="relative">
                                    <img 
                                        src={url} 
                                        alt={`Preview ${index + 1}`} 
                                        className="w-full h-24 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Revoke the object URL to prevent memory leaks
                                            URL.revokeObjectURL(url);
                                            
                                            const newImages = [...images];
                                            newImages.splice(index, 1);
                                            setImages(newImages);
                                            
                                            const newPreviews = [...imagePreviews];
                                            newPreviews.splice(index, 1);
                                            setImagePreviews(newPreviews);
                                        }}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Buttons */}

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose} // Close the modal when cancel is clicked
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit} // Submit and close modal only after submitting
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Create Vacancy
                    </button>
                    <button
                        onClick={handleDelete} // Delete and close modal after deletion
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Delete Seat
                    </button>
                </div>
            </div>
        </div>
    );
}

CreateVacancyModal.propTypes = {
    occupant_id: PropTypes.string.isRequired,
    messName: PropTypes.string.isRequired,
    messDescription: PropTypes.string.isRequired,
    messType: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    upazila: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    totalOccupants: PropTypes.number.isRequired,
    messManagerEmail: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired, // onClose should be passed from parent
    onCreateVacancy: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired, // onDelete should be passed from parent
};

export default CreateVacancyModal;
