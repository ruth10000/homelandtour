import React, { useState, useEffect, useCallback } from "react";
import "./Adashboard.css";
import { FaLocationDot } from "react-icons/fa6";

const API_BASE_URL = "http://localhost:3001/api/tours";
const IMAGE_BASE_URL = "http://localhost:3001/";

export default function Atour({ refreshDashboard }) {  // State Management
  const [toursData, setToursData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modal & Edit State
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    place: "",
    placeDetails: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Clean up Object URL when unmounting or changing image preview
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Fetch Tours (Supports Server-side Search with Debounce)
  const fetchTours = useCallback(async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `${API_BASE_URL}?search=${encodeURIComponent(query)}`
        : API_BASE_URL;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tours.");
      
      const data = await response.json();
      setToursData(data);
    } catch (err) {
      setError(err.message || "An error occurred while loading tours.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tours on mount and when search term changes (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTours(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchTours]);

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File Upload & Preview Handler
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open Modal for Create
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedTourId(null);
    setFormData({ place: "", placeDetails: "", price: "" });
    setImageFile(null);
    setImagePreview("");
    setError(null);
    setOpenModal(true);
  };

  // Open Modal for Edit
  const handleEdit = (tour) => {
    setIsEditing(true);
    setSelectedTourId(tour._id || tour.id);
    setFormData({
      place: tour.place,
      placeDetails: tour.placeDetails,
      price: tour.price,
    });
    setImageFile(null);

    const existingImageUrl = tour.image?.startsWith("http")
      ? tour.image
      : `${IMAGE_BASE_URL}${tour.image}`;
    setImagePreview(existingImageUrl);
    setError(null);
    setOpenModal(true);
  };

  // Close Modal Handler
  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditing(false);
    setSelectedTourId(null);
    setImageFile(null);
    setImagePreview("");
    setError(null);
  };

  // Submit Handler (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      alert("Please upload an image for the tour!");
      return;
    }

    setSubmitting(true);
    setError(null);

    const bodyFormData = new FormData();
    bodyFormData.append("place", formData.place);
    bodyFormData.append("placeDetails", formData.placeDetails);
    bodyFormData.append("price", formData.price);

    if (imageFile) {
      bodyFormData.append("image", imageFile);
    }

    try {
      const url = isEditing
        ? `${API_BASE_URL}/${selectedTourId}`
        : API_BASE_URL;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: bodyFormData,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} tour.`);
      }

      const savedTour = await response.json();

      if (isEditing) {
        setToursData((prev) =>
          prev.map((item) =>
            (item._id || item.id) === selectedTourId ? savedTour : item
          )
        );
      } else {
        setToursData((prev) => [...prev, savedTour]);
      }

      handleCloseModal();
      if (refreshDashboard) {
        refreshDashboard();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Tour Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tour.");
      }

      setToursData((prev) =>
        prev.filter((item) => (item._id || item.id) !== id)
      );
      if (refreshDashboard) {
        refreshDashboard();
      }
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  };

  return (
    <div className="atour-container">
      <h2>Tours</h2>
<div className="form-group">
                <input
                  type="text"
          placeholder="Search tours by place or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
                />
              </div>

      {/* Control Bar: Search & Add Button */}
      <div className="action-bar" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          Add Tour
        </button>
      </div>

      {/* Error Message */}
      {error && !openModal && (
        <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">Loading tours...</div>
      ) : (
        /* Tours Cards Grid */
        <div className="cards-grid">
          {toursData.length > 0 ? (
            toursData.map((tour) => {
              const tourId = tour._id || tour.id;
              const imageUrl = tour.image?.startsWith("http")
                ? tour.image
                : `${IMAGE_BASE_URL}${tour.image}`;

              return (
                <div className="tour-card" key={tourId}>
                  <img src={imageUrl} alt={tour.place} />

                  <div className="tour-card-body">
                    <h5>
                      <FaLocationDot /> {tour.place}
                    </h5>

                    <h3>${tour.price}</h3>

                    <p>{tour.placeDetails}</p>

                    <div className="button-group">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleEdit(tour)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(tourId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No tours found.</p>
          )}
        </div>
      )}

      {/* Modal Popup (Add / Edit) */}
      {openModal && (
        <div className="popup-overlay">
          <div className="form-container">
            <h3>{isEditing ? "Edit Tour" : "Add Tour"}</h3>

            {error && (
              <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="tour-form">
              <div className="form-group">
                <input
                  type="text"
                  name="place"
                  className="form-input"
                  placeholder="Place"
                  value={formData.place}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="placeDetails"
                  className="form-input form-textarea"
                  placeholder="Place Details"
                  value={formData.placeDetails}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Dynamic Image Preview */}
              {imagePreview && (
                <div className="image-preview" style={{ marginBottom: "1rem" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              )}

              <div className="form-group">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="image-upload"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEditing}
                  />

                  <label htmlFor="image-upload" className="file-label">
                    <span className={`file-placeholder ${imageFile ? "has-file" : ""}`}>
                      {imageFile
                        ? imageFile.name
                        : isEditing
                        ? "Change Image (Optional)"
                        : "Upload Image"}
                    </span>
                    <span className="upload-icon">📷</span>
                  </label>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : isEditing ? "Update" : "Add"}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}