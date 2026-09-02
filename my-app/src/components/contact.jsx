import Navbar from "./navbar";
import "./contact.css";
import '../index.css';
import { useActionState } from "react";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
export default function Contact() {
const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_amdce7g",
        "template_n4k0ly6",
        form.current,
        "AUDFvoV3W5ILH_ey3"
      )
      .then(
        () => {
          alert("Message sent successfully!");
        },
        (error) => {
          alert("Failed to send message");
          console.log(error.text);
        }
      );

    e.target.reset();
  };
  const navigate=useNavigate();
const handleClick=()=>{
  navigate('/Login');
}

  return (
    <>
    <Navbar/>
    <section className="contact">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            Have questions or want to plan your next adventure?  
            Our team is here to help you every step of the way.
          </p>

          <div className="info-item">
            <strong>📍 Location:</strong>
            <span>Addis Ababa, Ethiopia</span>
          </div>

          <div className="info-item">
            <strong>📞 Phone:</strong>
            <span>+251 909 224 433</span>
          </div>

          <div className="info-item">
            <strong>✉ Email:</strong>
            <span>homelandtour@gmail.com</span>
          </div>
        </div>

        <form ref={form} onSubmit={sendEmail}  
        className="contact-form">
          <h2>Send Message</h2>

          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          {/* <input type="text" placeholder="Subject" required /> */}

          <textarea rows="5" name="message" placeholder="Your Message" required />

          <button type="submit" >send</button>
        </form>
      </div>
      {/* <button className="btn" onClick={handleClick}><FaUser /></button> */}
    </section>
    </>
  );
}