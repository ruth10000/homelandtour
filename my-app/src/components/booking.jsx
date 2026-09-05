import { FaCalendarAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function Booking(){
  return(
    <section>
     <h1>Book Now</h1>
     <form action="">
      <h3><FaCalendarAlt />Date</h3>
      <input type="date" />
      <h3><IoPerson />number of people</h3>
      <input type="number" />
     </form>
    </section>
  )
}
