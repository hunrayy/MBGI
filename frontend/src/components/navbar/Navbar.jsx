import "./Nav.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import useCountdown from "./useCountdown"

export default function Navbar() {
  const timeLeft = useCountdown()
  return (
    <nav className="navbar-container">
      <Logo />

      <div className="navbar-countdown">
        {timeLeft ? (
          <div>
            <p style={{margin: "0", fontSize: "12px", fontWeight: "bold"}}>Voting Ends In</p>
            <span>
              {String(timeLeft.days).padStart(2, "0")}d{" "}
              {String(timeLeft.hours).padStart(2, "0")}h{" "}
              {String(timeLeft.minutes).padStart(2, "0")}m{" "}
              {String(timeLeft.seconds).padStart(2, "0")}s
            </span>

          </div>
          
        ) : (
          <span className="expired">Voting is now closed. </span>
        )}
      </div>
    </nav>
  );
}











































// // Nav.jsx
// import { useState } from "react";
// import "./Nav.css";
// import { Link, useNavigate } from "react-router-dom";
// import Logo from "../Logo/Logo";
// export default function Navbar() {
  

//   return (
//     <>
//       <nav className="navbar-container">
//         <Logo />
//       </nav>

      
//     </>
//   );
// }
