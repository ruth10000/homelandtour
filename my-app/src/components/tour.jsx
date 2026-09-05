import { useState } from "react";
import { useEffect } from "react";
import './tours.css';
import Navbar from "./navbar";
import emailjs from "@emailjs/browser";
import { useRef } from "react";


export default function Tours() {
  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const minDate = tomorrow.toISOString().split("T")[0];
  const to="tour";
  const form=useRef();
  const [selectedTour, setSelectedTour] = useState(null);
  const [tours,setTours]=useState([]);
  const sendEmail =(e)=>{
    e.preventDefault();
    if (selectedDate < minDate) {
    alert("Please select today or a future date.");
    return;
  }
    emailjs
    .sendForm(
      "service_amdce7g",
      "template_51uoojn",
      form.current,
      "AUDFvoV3W5ILH_ey3"
    )
    .then(
      ()=>{
        alert("Booked successfully!");
        },
        (error) => {
          alert("Booking Failed");
          console.log(error.text);
        }
    );
    e.target.reset();
  };
  useEffect(()=>{
    fetch("https://homelandtour.vercel.app/api/tours")
    .then((res)=>res.json()).then((data)=>setTours(data)).catch((err)=>console.log(err)) ;   
  },[]);
  
  return (
    <>      <Navbar />
  <section className="tours-page">
      
      <h1 className="title">Our Tours</h1>

      <div className="tour-grid">
        {tours.slice(0, 6).map((tour) => (
  <TourCard
    key={tour._id}
    {...tour}
    onBook={() => setSelectedTour(tour)}
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
        <input
    type="hidden"
    name="place"
    value={selectedTour.place}
    readOnly
  />

  <input
    type="hidden"
    name="price"
    value={selectedTour.price}
    readOnly
  /> 
  <input
    type="hidden"
    name="thispackage"
    value={to}
    readOnly
  />

        <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        />

        <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        />

        <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        required
        />

        <input
        type="number"
        name="people"
        placeholder="Number of Travelers"
        min="1"
        required
        />

        <input
        type="date"
        name="date"
        min={minDate}
        required
        />

        <textarea
        placeholder="Special Requests"
        name="specialreq"
        rows="4"
        />

        <div className="popup-buttons">

        <button
        type="submit"
        className="btn"
        >
        Book Tour
        </button>

        <button
        type="button"
        className="cancel-btn"
        onClick={() => setSelectedTour(null)}
        >
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

function TourCard({ place, placeDetails, price,image, onBook
 }) {
  return (
    <div className="tour-card">
      <img src={image} alt={place} />
      <h2>{place}</h2>
      <p>{placeDetails}</p>
      <h3>${price}</h3>
      <button className="btn"     onClick={onBook}
>Book Now</button>
    </div>
  );
}

