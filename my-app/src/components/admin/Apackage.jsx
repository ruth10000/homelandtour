import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Adashboard.css";
import "./Apackage.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt, FaHotel, FaPlus, FaTimes } from "react-icons/fa";

const API_BASE_URL   = "https://homelandtour.vercel.app/api/packages";
const HOTELS_API_URL = "https://homelandtour.vercel.app/api/hotels";
const IMAGE_BASE_URL = "https://homelandtour.vercel.app/";

export default function Apackage({ refreshDashboard }) {
  /* ─── package list ─── */
  const [packageData, setPackageData]   = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  /* ─── package modal ─── */
  const [openModal, setOpenModal]             = useState(false);
  const [isEditing, setIsEditing]             = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [submitting, setSubmitting]           = useState(false);
  const [formData, setFormData] = useState({
    place: "", day: "", placeDetails: "", price: "", hotelId: "",
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /* ─── hotels dropdown ─── */
  const [hotels, setHotels] = useState([]);

  /* ─── create-hotel sub-form ─── */
  const [showHotelForm, setShowHotelForm]       = useState(false);
  const [hotelFormData, setHotelFormData]       = useState({ name: "", description: "" });
  const [hotelImages, setHotelImages]           = useState([]);      // File[]
  const [hotelImagePreviews, setHotelImagePreviews] = useState([]);  // string[]
  const [hotelSubmitting, setHotelSubmitting]   = useState(false);
  const [hotelError, setHotelError]             = useState(null);
  const hotelFileRef = useRef(null);

  /* cleanup blob URLs */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      hotelImagePreviews.forEach((u) => { if (u.startsWith("blob:")) URL.revokeObjectURL(u); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── fetch packages on mount ─── */
  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch packages.");
      setPackageData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch(HOTELS_API_URL);
      if (!res.ok) return;
      setHotels(await res.json());
    } catch { /* silently ignore — dropdown will just be empty */ }
  };

  /* ─── package form handlers ─── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const openAdd = () => {
    setIsEditing(false); setSelectedPackageId(null);
    setFormData({ place: "", day: "", placeDetails: "", price: "", hotelId: "" });
    setImageFile(null); setImagePreview("");
    setError(null); setShowHotelForm(false);
    fetchHotels(); setOpenModal(true);
  };

  const openEdit = (pkg) => {
    setIsEditing(true); setSelectedPackageId(pkg._id || pkg.id);

    // hotel._id comes back as an ObjectId object from Mongoose — convert to string
    // so the <select> value comparison works correctly
    const hotelId = pkg.hotel?._id
      ? String(pkg.hotel._id)
      : pkg.hotel
      ? String(pkg.hotel)
      : "";

    setFormData({
      place: pkg.place, day: pkg.day, placeDetails: pkg.placeDetails,
      price: pkg.price, hotelId,
    });
    setImageFile(null);
    setImagePreview(pkg.image?.startsWith("http") || pkg.image?.startsWith("data:") ? pkg.image : `${IMAGE_BASE_URL}${pkg.image}`);
    setError(null); setShowHotelForm(false);
    fetchHotels(); setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false); setIsEditing(false); setSelectedPackageId(null);
    setImageFile(null); setImagePreview(""); setError(null);
    setShowHotelForm(false); resetHotelForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !imageFile) { alert("Please upload a package image!"); return; }
    setSubmitting(true); setError(null);

    const fd = new FormData();
    fd.append("place", formData.place);
    fd.append("day", formData.day);
    fd.append("placeDetails", formData.placeDetails);
    fd.append("price", formData.price);
    fd.append("hotelId", formData.hotelId);
    if (imageFile) fd.append("image", imageFile);

    try {
      const url    = isEditing ? `${API_BASE_URL}/${selectedPackageId}` : API_BASE_URL;
      const method = isEditing ? "PUT" : "POST";
      const res    = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error(`Failed to ${isEditing ? "update" : "add"} package.`);
      const saved = await res.json();

      setPackageData((prev) =>
        isEditing
          ? prev.map((i) => (i._id || i.id) === selectedPackageId ? saved : i)
          : [...prev, saved]
      );
      closeModal();
      if (refreshDashboard) refreshDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      setPackageData((prev) => prev.filter((i) => (i._id || i.id) !== id));
      if (refreshDashboard) refreshDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ─── hotel sub-form handlers ─── */
  const resetHotelForm = () => {
    setHotelFormData({ name: "", description: "" });
    hotelImagePreviews.forEach((u) => { if (u.startsWith("blob:")) URL.revokeObjectURL(u); });
    setHotelImages([]); setHotelImagePreviews([]); setHotelError(null);
  };

  const handleHotelInput = (e) => {
    const { name, value } = e.target;
    setHotelFormData((p) => ({ ...p, [name]: value }));
  };

  const handleHotelImages = (e) => {
    const files = Array.from(e.target.files);
    const total = hotelImages.length + files.length;
    if (total > 4) {
      setHotelError("You can upload a maximum of 4 images.");
      return;
    }
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setHotelImages((p) => [...p, ...files]);
    setHotelImagePreviews((p) => [...p, ...newPreviews]);
    setHotelError(null);
    // reset the file input so the same file can be re-selected if removed
    if (hotelFileRef.current) hotelFileRef.current.value = "";
  };

  const removeHotelImage = (idx) => {
    const preview = hotelImagePreviews[idx];
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setHotelImages((p) => p.filter((_, i) => i !== idx));
    setHotelImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    if (hotelImages.length === 0) { setHotelError("Add at least 1 image."); return; }
    setHotelSubmitting(true); setHotelError(null);

    const fd = new FormData();
    fd.append("name", hotelFormData.name);
    fd.append("description", hotelFormData.description);
    hotelImages.forEach((file) => fd.append("images", file));

    try {
      const res = await fetch(HOTELS_API_URL, { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create hotel.");
      }
      const created = await res.json();
      setHotels((p) => [...p, created]);
      setFormData((p) => ({ ...p, hotelId: created._id }));
      setShowHotelForm(false);
      resetHotelForm();
    } catch (err) {
      setHotelError(err.message);
    } finally {
      setHotelSubmitting(false);
    }
  };

  /* ─── filtered list ─── */
  const filteredPackages = useMemo(() =>
    packageData.filter((pkg) =>
      pkg.place?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.placeDetails?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [packageData, searchTerm]);

  /* ─── render ─── */
  return (
    <div className="apackage-container">
      <h2>Tour Packages</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="action-bar" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={openAdd} className="btn btn-primary">Add Package</button>
      </div>

      {error && !openModal && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      {loading ? (
        <div>Loading packages...</div>
      ) : (
        <div className="cards-grid">
          {filteredPackages.length > 0 ? filteredPackages.map((pkg) => {
            const pkgId    = pkg._id || pkg.id;
            const imageUrl = pkg.image?.startsWith("http") || pkg.image?.startsWith("data:") ? pkg.image : `${IMAGE_BASE_URL}${pkg.image}`;
            return (
              <div className="tour-card" key={pkgId}>
                <img src={imageUrl} alt={pkg.place} />
                <div className="tour-card-body">
                  <h5><FaLocationDot /> {pkg.place}</h5>
                  <h5><FaCalendarAlt /> {pkg.day} Days</h5>
                  <h5><FaHotel /> {pkg.hotel?.name ?? "No hotel assigned"}</h5>
                  <h3>${pkg.price}</h3>
                  <p>{pkg.placeDetails}</p>
                  <div className="button-group">
                    <button className="btn btn-primary" onClick={() => openEdit(pkg)}>Edit</button>
                    <button className="btn btn-danger"  onClick={() => handleDelete(pkgId)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          }) : <p>No packages found.</p>}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {openModal && (
        <div className="popup-overlay">
          <div className="form-container ap-modal">
            <h3>{isEditing ? "Edit Package" : "Add Package"}</h3>
            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

            <form onSubmit={handleSubmit} className="tour-form">
              <div className="form-group">
                <input type="text" name="place" className="form-input" placeholder="Place"
                  value={formData.place} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input type="number" name="day" className="form-input" placeholder="Days"
                  value={formData.day} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <textarea name="placeDetails" className="form-input form-textarea" placeholder="Place Details"
                  value={formData.placeDetails} onChange={handleInputChange} rows="4" required />
              </div>
              <div className="form-group">
                <input type="number" name="price" className="form-input" placeholder="Price"
                  value={formData.price} onChange={handleInputChange} required />
              </div>

              {/* ── Hotel selector ── */}
              <div className="form-group">
                <label className="ap-label">Hotel</label>
                <select name="hotelId" className="form-input" value={formData.hotelId} onChange={handleInputChange}>
                  <option value="">— No Hotel —</option>
                  {hotels.map((h) => (
                    <option key={h._id} value={String(h._id)}>{h.name}</option>
                  ))}
                </select>
              </div>

              {/* toggle create-hotel sub-form */}
              <button
                type="button"
                className="ap-add-hotel-toggle"
                onClick={() => { setShowHotelForm((v) => !v); setHotelError(null); }}
              >
                <FaPlus /> {showHotelForm ? "Cancel New Hotel" : "Create New Hotel"}
              </button>

              {/* ── Create Hotel sub-form ── */}
              {showHotelForm && (
                <div className="ap-hotel-subform">
                  <h4>New Hotel</h4>

                  {hotelError && <div className="ap-hotel-error">{hotelError}</div>}

                  <div className="form-group">
                    <input type="text" name="name" className="form-input" placeholder="Hotel name"
                      value={hotelFormData.name} onChange={handleHotelInput} required />
                  </div>
                  <div className="form-group">
                    <textarea name="description" className="form-input form-textarea"
                      placeholder="Hotel description (optional)"
                      value={hotelFormData.description} onChange={handleHotelInput} rows="3" />
                  </div>

                  {/* image previews */}
                  {hotelImagePreviews.length > 0 && (
                    <div className="ap-hotel-previews">
                      {hotelImagePreviews.map((src, idx) => (
                        <div key={idx} className="ap-hotel-preview-wrap">
                          <img src={src} alt={`hotel-${idx + 1}`} />
                          <button
                            type="button"
                            className="ap-remove-img"
                            onClick={() => removeHotelImage(idx)}
                            aria-label="Remove image"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* file input — only show if fewer than 4 images added */}
                  {hotelImages.length < 4 && (
                    <div className="form-group">
                      <input
                        type="file"
                        id="hotel-image-upload"
                        className="form-input ap-file-btn"
                        accept="image/*"
                        multiple
                        ref={hotelFileRef}
                        onChange={handleHotelImages}
                      />
                      <p className="ap-hint">{4 - hotelImages.length} image slot(s) remaining (max 4)</p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    disabled={hotelSubmitting || hotelImages.length === 0 || !hotelFormData.name}
                    onClick={handleCreateHotel}
                  >
                    {hotelSubmitting ? "Creating…" : "Create Hotel & Select"}
                  </button>
                </div>
              )}

              {/* ── Package image ── */}
              {imagePreview && (
                <div style={{ marginBottom: "1rem" }}>
                  <img src={imagePreview} alt="Preview"
                    style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "6px" }} />
                </div>
              )}
              <div className="form-group">
                <div className="file-input-wrapper">
                  <input type="file" id="image-upload" className="file-input" accept="image/*"
                    onChange={handleFileChange} required={!isEditing} />
                  <label htmlFor="image-upload" className="file-label">
                    <span className={`file-placeholder ${imageFile ? "has-file" : ""}`}>
                      {imageFile ? imageFile.name : isEditing ? "Change Image (Optional)" : "Upload Package Image"}
                    </span>
                    <span className="upload-icon">📷</span>
                  </label>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : isEditing ? "Update" : "Add"}
                </button>
                <button type="button" className="btn btn-danger" onClick={closeModal} disabled={submitting}>
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


