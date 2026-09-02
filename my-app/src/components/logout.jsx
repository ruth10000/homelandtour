import "./home.css";
export default function Logout({setIsLoggedin}){
  const handleLogout =()=>{

    setIsLoggedin(false);
    

  };
  return(
    <button onClick={handleLogout} className="logout-btn">➜</button>
    );
}