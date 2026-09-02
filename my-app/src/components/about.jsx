import eth from "../assets/eth.jpg";
import Navbar from "./navbar";
import "./about.css";
export default function About() {
  return (
    <>
      <Navbar />
      <section className="about">
        
        
        <div className="grid-about">
         
          <div className="img">
            <img
              src={eth}
              alt="Ethiopian Landscape"
            />
          </div>

          
          <div className="about-content">
            
            
            <h1>About Us</h1>
            <p>
              Homeland Tour is a trusted tour agency in Ethiopia, dedicated to creating memorable travel experiences across the country’s most remarkable destinations. With over five years of experience, we have proudly served thousands of satisfied travelers from around the world.
            </p>
            <p>
              Our goal is to showcase Ethiopia’s natural beauty, rich culture, and unique history through carefully planned tours that blend adventure, comfort, and authenticity. Our knowledgeable local guides are passionate about sharing their expertise and ensuring every guest enjoys a safe, enjoyable, and meaningful journey.
            </p>
            <p>
              At Homeland Tour, we believe travel should inspire, connect, and leave lasting memories. Whether you are seeking adventure, cultural discovery, or relaxation, we are committed to making your experience truly unforgettable.
            </p>

          </div>

        </div>
      </section>
    </>
  );
}