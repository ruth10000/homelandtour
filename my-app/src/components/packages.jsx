import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt, FaHotel } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import "./packages.css";
import emailjs from "@emailjs/browser";

export default function Packages() {
  const form = useRef();
  const [selectedTour, setSelectedTour] = useState(null);
  const [packageData, setPackageData] = useState([]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const pa = "package";

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
        },
        (error) => {
          alert("Booking Failed");
          console.log(error.text);
        }
      );
    e.target.reset();
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/packages")
      .then((res) => res.json())
      .then((data) => setPackageData(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />

      <section className="packages">
        <h1>Awesome Packages</h1>

        <div className="p-grid">
          {packageData.slice(0, 6).map((pack) => (
            <PackCard
              key={pack._id}
              {...pack}
              onBook={() => setSelectedTour(pack)}
            />
          ))}
        </div>

        {selectedTour && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Book</h2>
              <p>
                <strong>{selectedTour.place}</strong>
              </p>

              <form ref={form} onSubmit={sendEmail}>
                <input type="hidden" name="place" value={selectedTour.place} readOnly />
                <input type="hidden" name="price" value={selectedTour.price} readOnly />
                <input type="hidden" name="thispackage" value={pa} readOnly />

                <input type="text" name="name" placeholder="Full Name" required />
                <input type="email" name="email" placeholder="Email Address" required />
                <input type="tel" name="phone" placeholder="Phone Number" required />
                <input type="number" name="people" placeholder="Number of Travelers" min="1" required />
                <input type="date" name="date" min={minDate} required />
                <textarea placeholder="Special Requests" name="specialreq" rows="4" />

                <div className="popup-buttons">
                  <button type="submit" className="btn">Book Tour</button>
                  <button type="button" className="cancel-btn" onClick={() => setSelectedTour(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function PackCard({ _id, image, place, day, price, placeDetails, hotel, onBook }) {
  return (
    <div className="p-card">
      <img src={image} alt={place} />

      <div className="detail">
        <h5>
          <FaLocationDot />
          {place}
        </h5>
        <h5>
          <FaCalendarAlt />
          {day} Days
        </h5>
        <h5>
          <FaHotel />
          {hotel?.name ?? "No hotel assigned"}
        </h5>
      </div>

      <h3>${price}</h3>
      <p>{placeDetails}</p>

      <Link
        to={`/packages/${_id}`}
        className="read-more-link"
      >
        Read More →
      </Link>

      <button className="btn" onClick={onBook}>
        Book Now
      </button>
    </div>
  );
}
