import { useState, useEffect } from "react";

export default function useCountdown() {
  const targetDate = new Date(new Date().getFullYear(), 10, 20, 23, 59, 59);

  const calculateTimeLeft = () => {
    const difference = targetDate - new Date();
    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft); // calculate immediately

  useEffect(() => {
    const updateTime = () => {
      if (document.hidden) return;
      setTimeLeft(calculateTimeLeft());
    };

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}


















// import { useState, useEffect } from "react";

// export default function useCountdown() {
//   const [timeLeft, setTimeLeft] = useState(null);

//   useEffect(() => {
//     const targetDate = new Date(new Date().getFullYear(), 10, 20, 23, 59, 59);

//     const updateTime = () => {
//       if (document.hidden) return;

//       const now = new Date();
//       const difference = targetDate - now;

//       if (difference <= 0) {
//         setTimeLeft(null);
//         return;
//       }

//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
//       const minutes = Math.floor((difference / (1000 * 60)) % 60);
//       const seconds = Math.floor((difference / 1000) % 60);

//       setTimeLeft({
//         days: String(days).padStart(2, "0"),
//         hours: String(hours).padStart(2, "0"),
//         minutes: String(minutes).padStart(2, "0"),
//         seconds: String(seconds).padStart(2, "0"),
//       });
//     };

//     updateTime(); // run immediately on mount
//     const timer = setInterval(updateTime, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   return timeLeft;
// }
