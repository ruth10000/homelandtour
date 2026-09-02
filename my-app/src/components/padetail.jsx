import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaHotel, FaArrowLeft, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import Navbar from "./navbar";
import "./padetail.css";

export default function Padetail() {
  const { id } = useParams();
  const [pkg, setPkg]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // booking popup state
  const [showBooking, setShowBooking] = useState(false);
  const form = useRef();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://homelandtour.onrender.com/api/packages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Package not found");
        return res.json();
      })
      .then((data) => setPkg(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_amdce7g",
        "template_51uoojn",
        form.current,
        "AUDFvoV3W5ILH_ey3"
      )
      .then(
        () => {
          alert("Booked successfully!");
          setShowBooking(false);
        },
        (err) => {
          alert("Booking failed. Please try again.");
          console.error(err);
        }
      );
    e.target.reset();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pd-state-container">
          <div className="pd-loading">
            <div className="pd-spinner" />
            <p>Loading package details…</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pd-state-container">
          <div className="pd-error">
            <h2>Oops!</h2>
            <p>{error}</p>
            <Link to="/packages" className="pd-back-link">
              <FaArrowLeft /> Back to Packages
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="padetail">

        {/* ── Hero ── */}
        <div className="pd-hero" style={{ backgroundImage: `url(${pkg.image})` }}>
          <div className="pd-hero-overlay" />
          <div className="pd-hero-caption">
            <Link to="/packages" className="pd-back-link">
              <FaArrowLeft /> All Packages
            </Link>
            <h1>{pkg.place}</h1>
            <div className="pd-hero-bottom">
              <span className="pd-price">
                <FaDollarSign className="pd-price-icon" />
                {pkg.price}
              </span>
              <button className="pd-book-btn" onClick={() => setShowBooking(true)}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="pd-body">
          <section className="pd-info">
            <div className="pd-info-badge">
              <FaCalendarAlt />
              <span>{pkg.day} Days</span>
            </div>
            <p className="pd-desc">{pkg.placeDetails}</p>

            {/* Book Now button also here for easy access */}
            <button className="pd-book-btn pd-book-btn--outline" onClick={() => setShowBooking(true)}>
              Book Now
            </button>
          </section>

          {/* ── Hotel ── */}
          <section className="pd-hotel-section">
            <h2 className="pd-section-title">
              <FaHotel className="pd-section-icon" />
              Accommodation
            </h2>

            {pkg.hotel ? (
              <div className="pd-hotel-card">
                {pkg.hotel.images && pkg.hotel.images.length > 0 && (
                  <div className={`pd-hotel-gallery pd-hotel-gallery--${Math.min(pkg.hotel.images.length, 4)}`}>
                    {pkg.hotel.images.slice(0, 4).map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`${pkg.hotel.name} — photo ${idx + 1}`}
                        className="pd-hotel-gallery-img"
                      />
                    ))}
                  </div>
                )}
                <div className="pd-hotel-info">
                  <h3>{pkg.hotel.name}</h3>
                  {pkg.hotel.description && <p>{pkg.hotel.description}</p>}
                </div>
              </div>
            ) : (
              <div className="pd-no-hotel">
                <FaHotel className="pd-no-hotel-icon" />
                <p>No hotel has been assigned to this package yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Booking popup ── */}
      {showBooking && (
        <div className="popup-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowBooking(false); }}>
          <div className="popup">
            <h2>Book</h2>
            <p><strong>{pkg.place}</strong></p>

            <form ref={form} onSubmit={sendEmail}>
              {/* hidden fields so emailjs template gets tour/package info */}
              <input type="hidden" name="place"       value={pkg.place}    readOnly />
              <input type="hidden" name="price"       value={pkg.price}    readOnly />
              <input type="hidden" name="thispackage" value="package"      readOnly />

              <input type="text"   name="name"   placeholder="Full Name"            required />
              <input type="email"  name="email"  placeholder="Email Address"        required />
              <input type="tel"    name="phone"  placeholder="Phone Number"         required />
              <input type="number" name="people" placeholder="Number of Travelers"  min="1" required />
              <input type="date"   name="date"   min={minDate}                       required />
              <textarea name="specialreq" placeholder="Special Requests" rows="4" />

              <div className="popup-buttons">
                <button type="submit" className="btn">Book Now</button>
                <button type="button" className="cancel-btn" onClick={() => setShowBooking(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

