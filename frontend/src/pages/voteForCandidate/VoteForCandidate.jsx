

// import { useState, useEffect } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import "./voteForCandidate.css";
// // import image from "../../../public/testContestantImage.jpeg"
// import image from "../../../public/testContestantImage.jpeg"
// import { useContestants } from "../../components/contestants/useContestants";
// import Loader from "../../components/loader/Loader";
// import axios from "axios";

// const VoteForCandidate = () => {
//   const navigate = useNavigate()
//   const { name, contestant_number } = useParams();
//   const { state } = useLocation()
//   const { data: contestants, isLoading, error } = useContestants();






  
//   console.log(contestants)
  
//   const candidateFromState = state?.contestant
//    const candidate = contestants?.find(
//       (c) =>
//         c.fullname.toLowerCase().replace(/\s+/g, "-") === name &&
//         String(c.contestant_number) === String(contestant_number)
//     );
//   const parsedName = name
//     .replaceAll("-", " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());
//     console.log(parsedName, contestant_number)

//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1); // 1 = user info, 2 = payment details
//   const [userInfo, setUserInfo] = useState({ fullName: "", email: "", numberOfVotes: "" });
//   const [accountDetails, setAccountDetails] = useState(null);
//   const [generatingAccountNumberLoader, setGeneratingAccountNumberLoader] = useState(false)

  
//   const handleChange = (e) => {
//     setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
//   };

//   const validateFullName = (name) => {
//     const words = name.trim().split(/\s+/);
//     if (words.length < 2) return false;
//     const wordRegex = /^[A-Za-z'-]{2,}$/;
//     return words.every((word) => wordRegex.test(word));
//   };

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleNextStep = async () => {
//     if (!validateFullName(userInfo.fullName)) {
//       toast.error("Please enter a valid full name (first and last name).");
//       return;
//     }
//     if (!validateEmail(userInfo.email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }
//     if (!userInfo.numberOfVotes || !userInfo.numberOfVotes > 0) {
//       toast.error("Please enter a valid number of votes.");
//       return;
//     }

//     try {
//       setGeneratingAccountNumberLoader(true)

//       // 🔹 Example API call
//       const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate-dynamic-account-number`, {
//         fullName: userInfo.fullName,
//         email: userInfo.email,
//         numberOfVotes: userInfo.numberOfVotes,
//         contestantName: candidate.fullname,
//         contestantNumber: candidate.contestant_number,
//       });

//       // if (!response.ok) throw new Error("Failed to generate account number");
//       console.log(feedback)
//       if(feedback.data.code === "success"){
//           const authorizationUrl = feedback.data.data.authorization_url;
//           if (authorizationUrl) {
//             // Redirect the user to Paystack's payment page
//             window.location.href = authorizationUrl;
//           } else {
//             toast.error("Payment URL not found. Please try again.");
//           }
//         // setAccountDetails({
//         //   bank: feedback.data.data.bank,
//         //   accountName: feedback.data.data.accountName,
//         //   accountNumber: feedback.data.data.accountNumber,
//         // });

//         // setStep(2);
//       }

//       // const data = await response.json();
      
      
//       // toast.success("Account details ready!");
//     } catch (err) {
//       console.error(err);
//       toast.error("An error occurred while retrieving account details. Please try again.");
//     }finally{
//       setGeneratingAccountNumberLoader(false)
//     }
//   };

  
//   const handleCopy = () => {
//     navigator.clipboard.writeText(accountDetails.accountNumber);
//     toast.success("Account number copied!");
//   };
//   useEffect(() => {
//     if (!isLoading && !candidate && !error) {
//       navigate("/page-not-found", { replace: true });
//     }
//   }, [isLoading, candidate, error, navigate]);
  
//     if (isLoading) return;
//   if (error) return <h1 className="alert alert-danger">Error loading contestants</h1>;
//   // Guard against undefined candidate
// if (!candidate) return <h1>Candidate not found...</h1>;
//   return (
//     <div className="vote-component-container">
//       <Navbar />
//       {generatingAccountNumberLoader && <Loader />}

//       <div className="vote-page-content">
//         {/* Candidate Image */}
//         <div className="candidate-image-section">
//           <img
//             src={candidate.image}
//             alt={candidate.name}
//             className="candidate-image"

//           />
//         </div>

//         {/* Candidate Details */}
//         <div className="candidate-details-section">
//           <h1 className="candidate-name">{candidate.fullname}</h1>
//           <p className="contestant-desc" style={{fontFamily: "'Orbitron', sans-serif", fontSize: "20px"}}>
//                 Contestant Number {String(candidate.contestant_number).padStart(2, "0")}
//               </p>
//           <div className="vote-action-box">
//             <div className="crown-icon-wrapper">
//               <i className="fa fa-crown"></i>
//             </div>

//             <h2 className="vote-heading">
//               VOTE FOR {candidate.fullname.toUpperCase()}
//             </h2>
//             <p className="vote-subtext">Each vote costs ₦100</p>

//             <button
//               className="cast-vote-btn"
//               onClick={() => {
//                 setShowModal(true);
//                 setStep(1);
//               }}
//             >
//               CAST YOUR VOTE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {/* {showModal && ( */}
//         {/* <div
//           className="payment-modal-overlay"
//           onClick={() => setShowModal(false)}
//         > */}
//         <div
//   className={`payment-modal-overlay ${showModal ? "show" : "hide"}`}
//   onClick={() => setShowModal(false)} // clicking overlay closes modal
// >
//           <div
//             className="vote-component-payment-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="close-modal-btn"
//               onClick={() => setShowModal(false)}
//             >
//               &times;
//             </button>










//                 {/* VOTING MODAL */}















//             {/* Step 1: User Info */}
//             {step === 1 && (
//               <div className="user-info-form">
//                 <div className="modal-crown-wrapper">
//                   <i className="fa fa-crown"></i>
//                 </div>

//                 <h2 className="modal-vote-heading">
//                   VOTE FOR {candidate.fullname.toUpperCase()}
//                 </h2>
//                 <hr className="modal-underline" />

//                 <div className="modal-candidate-info">
//                 <img src={candidate.image} alt={candidate.fullname} className="modal-candidate-image" />
                  
//                   <div className="modal-candidate-text">
//                     <h4 style={{ color: "white" }}>{candidate.fullname}</h4>
//                     <p>Vote Price: ₦100 each</p>
//                   </div>
//                 </div>
//                 <hr className="modal-underline" />

//                 <input
//                   type="text"
//                   name="fullName"
//                   placeholder="Full name"
//                   value={userInfo.fullName}
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={userInfo.email}
//                   onChange={handleChange}
//                 />
//                 <p className="email-note">
//                   Please input your valid email address as a receipt of your vote will be sent.
//                 </p>

//                 <input
//                   type="text"
//                   name="numberOfVotes"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
//                   placeholder="Number of votes"
//                   value={userInfo.numberOfVotes}
//                   onChange={handleChange}
//                 />

//                 <button className="next-step-btn" onClick={handleNextStep}>
//                   Proceed to Payment
//                 </button>
//               </div>
//             )}











//                 {/* PAYMENT MODAL */}






//             {/* Step 2: Payment Details */}
//             {step === 2 && accountDetails && (
//               <div className="payment-details">
//                 <h2 style={{color: "white"}}>Bank Transfer Details</h2>
//                 <p>Please make your payment using the account details below:</p>

//                 <div className="account-details">
//                   <p>
//                     <strong>Bank:</strong> {accountDetails.bank}
//                   </p>
//                   <p>
//                     <strong>Account Name:</strong> {accountDetails.accountName}
//                   </p>
//                   <p>
//                     <strong>Account Number:</strong>{" "}
//                     <span className="account-number">
//                       {accountDetails.accountNumber}
//                     </span>
//                   </p>
//                   <button className="copy-btn" onClick={handleCopy}>
//                     Copy Account Number
//                   </button>
//                 </div>

//                 {/* <p className="modal-note">
//                   After making your transfer, please confirm your payment on
//                   this page.
//                 </p> */}
//               </div>
//             )}
//           </div>
//         </div>
//       {/* )} */}

//       <Footer />
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </div>
//   );
// };

// export default VoteForCandidate;

















































import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./voteForCandidate.css";
// import image from "../../../public/testContestantImage.jpeg"
import image from "../../../public/testContestantImage.jpeg"
import { useContestants } from "../../components/contestants/useContestants";
import Loader from "../../components/loader/Loader";
import axios from "axios";
const VoteForCandidate = () => {
  const navigate = useNavigate()
  const { name, contestant_number } = useParams();
  const { state } = useLocation()
  const { data: contestants, isLoading, error } = useContestants();






  
  console.log(contestants)
  
  const candidateFromState = state?.contestant
   const candidate = contestants?.find(
      (c) =>
        c.fullname.toLowerCase().replace(/\s+/g, "-") === name &&
        String(c.contestant_number) === String(contestant_number)
    );
  const parsedName = name
    .replaceAll("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
    console.log(parsedName, contestant_number)

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1 = user info, 2 = payment details
  const [userInfo, setUserInfo] = useState({ fullName: "", email: "", numberOfVotes: "" });
  const [accountDetails, setAccountDetails] = useState(null);
  const [generatingAccountNumberLoader, setGeneratingAccountNumberLoader] = useState(false)
  
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const validateFullName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return false;
    const wordRegex = /^[A-Za-z'-]{2,}$/;
    return words.every((word) => wordRegex.test(word));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

const handleNextStep = async () => {
  if (!validateFullName(userInfo.fullName)) {
    toast.error("Please enter a valid full name (first and last name).");
    return;
  }
  if (!validateEmail(userInfo.email)) {
    toast.error("Please enter a valid email address.");
    return;
  }
  if (!userInfo.numberOfVotes || userInfo.numberOfVotes <= 0) {
    toast.error("Please enter a valid number of votes.");
    return;
  }

  try {
    setGeneratingAccountNumberLoader(true);

    // 🔹 Step 1: Ask your backend to prepare a Paystack transaction
    const feedback = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/generate-dynamic-account-number`,
      {
        fullName: userInfo.fullName,
        email: userInfo.email,
        numberOfVotes: userInfo.numberOfVotes,
        contestantName: candidate.fullname,
        contestantNumber: candidate.contestant_number,
      }
    );
    console.log(feedback)

    if (feedback.data.code !== "success") {
      toast.error(feedback.data.message || "Could not initialize payment. Please try again.");
      return;
    }
    // Redirect user to Paystack's payment page
    window.location.href = feedback.data.data.authorization_url;
        // ✅ Use PaystackPop.setup (not new PaystackPop)
    // const handler = window.PaystackPop.setup({
    //   key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    //   email: userInfo.email,
    //   amount: feedback.data.data.amount,
    //   reference: feedback.data.data.reference,
    //   callback: function (response) {
    //     console.log("Payment complete:", response);
    //     axios
    //       .post(`${import.meta.env.VITE_BACKEND_URL}/verify-payment`, {
    //         reference: response.reference,
    //       })
    //       .then((verifyResponse) => {
    //         if (verifyResponse.data.status === "success") {
    //           toast.success("Vote payment successful!");
    //           setStep(2);
    //         } else {
    //           toast.error("Verification failed. Please contact support.");
    //         }
    //       })
    //       .catch(() => {
    //         toast.error("Error verifying payment.");
    //       });
    //   },
    //   onClose: function () {
    //     toast.info("Payment window closed.");
    //   },
    // });

    // handler.openIframe();

  } catch (err) {
    console.error(err);
    toast.error("Unable to reach Paystack at this time. Check your connection and try again.");
  } finally {
    setGeneratingAccountNumberLoader(false);
  }
};



// const handleNextStep = () => {
//   if (!validateFullName(userInfo.fullName) || !validateEmail(userInfo.email) || !userInfo.numberOfVotes) {
//     toast.error("All fields required");
//     return;
//   }

//   navigate(`/vote-for/${name}/contestant-number/${contestant_number}/payment`, {
//     state: {
//       background: location.pathname, // optional: if you want to overlay modal
//       userInfo,
//       contestantName: candidate.fullname,
//     },
//   });
// };

  
  // const handleCopy = () => {
  //   navigator.clipboard.writeText(accountDetails.accountNumber);
  //   toast.success("Account number copied!");
  // };
  useEffect(() => {
    if (!isLoading && !candidate && !error) {
      navigate("/page-not-found", { replace: true });
    }
  }, [isLoading, candidate, error, navigate]);
  
    if (isLoading) return;
  if (error) return <h1 className="alert alert-danger">Error loading contestants</h1>;
  // Guard against undefined candidate
if (!candidate) return <h1>Candidate not found...</h1>;
  return (
    <div className="vote-component-container">
      <Navbar />
      {generatingAccountNumberLoader && <Loader />}

      <div className="vote-page-content">
        {/* Candidate Image */}
        <div className="candidate-image-section">
          <img
            src={candidate.image}
            alt={candidate.name}
            className="candidate-image"

          />
        </div>

        {/* Candidate Details */}
        <div className="candidate-details-section">
          <h1 className="candidate-name">{candidate.fullname}</h1>
          <p className="contestant-desc" style={{fontFamily: "'Orbitron', sans-serif", fontSize: "20px"}}>
                Contestant Number {String(candidate.contestant_number).padStart(2, "0")}
              </p>
          <div className="vote-action-box">
            <div className="crown-icon-wrapper">
              <i className="fa fa-crown"></i>
            </div>

            <h2 className="vote-heading">
              VOTE FOR {candidate.fullname.toUpperCase()}
            </h2>
            <p className="vote-subtext">Each vote costs ₦100</p>

            <button
              className="cast-vote-btn"
              onClick={() => {
                setShowModal(true);
                setStep(1);
              }}
            >
              CAST YOUR VOTE
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* {showModal && ( */}
        {/* <div
          className="payment-modal-overlay"
          onClick={() => setShowModal(false)}
        > */}
        <div
  className={`payment-modal-overlay ${showModal ? "show" : "hide"}`}
  onClick={() => setShowModal(false)} // clicking overlay closes modal
>
          <div
            className="vote-component-payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>










                {/* VOTING MODAL */}















            {/* Step 1: User Info */}
            {step === 1 && (
              <div className="user-info-form">
                <div className="modal-crown-wrapper">
                  <i className="fa fa-crown"></i>
                </div>

                <h2 className="modal-vote-heading">
                  VOTE FOR {candidate.fullname.toUpperCase()}
                </h2>
                <hr className="modal-underline" />

                <div className="modal-candidate-info">
                <img src={candidate.image} alt={candidate.fullname} className="modal-candidate-image" />
                  
                  <div className="modal-candidate-text">
                    <h4 style={{ color: "white" }}>{candidate.fullname}</h4>
                    <p>Vote Price: ₦100 each</p>
                  </div>
                </div>
                <hr className="modal-underline" />

                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={userInfo.fullName}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userInfo.email}
                  onChange={handleChange}
                />
                <p className="email-note">
                  Please input your valid email address as a receipt of your vote will be sent.
                </p>

                <input
                  type="text"
                  name="numberOfVotes"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  placeholder="Number of votes"
                  value={userInfo.numberOfVotes}
                  onChange={handleChange}
                />

                <button className="next-step-btn" onClick={handleNextStep}>
                  Proceed to Payment
                </button>
              </div>
            )}











                {/* PAYMENT MODAL */}






            {/* Step 2: Payment Details */}
            {step === 2 && accountDetails && (
              <div className="payment-details">
                <h2 style={{color: "white"}}>Bank Transfer Details</h2>
                <p>Please make your payment using the account details below:</p>

                <div className="account-details">
                  <p>
                    <strong>Bank:</strong> {accountDetails.bank}
                  </p>
                  <p>
                    <strong>Account Name:</strong> {accountDetails.accountName}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    <span className="account-number">
                      {accountDetails.accountNumber}
                    </span>
                  </p>
                  <button className="copy-btn" onClick={handleCopy}>
                    Copy Account Number
                  </button>
                </div>

                {/* <p className="modal-note">
                  After making your transfer, please confirm your payment on
                  this page.
                </p> */}
              </div>
            )}
          </div>
        </div>
      {/* )} */}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default VoteForCandidate;



































































// import { useState, useEffect } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import "./voteForCandidate.css";
// // import image from "../../../public/testContestantImage.jpeg"
// import image from "../../../public/testContestantImage.jpeg"
// import { useContestants } from "../../components/contestants/useContestants";
// import Loader from "../../components/loader/Loader";
// import axios from "axios";

// const VoteForCandidate = () => {
//   const navigate = useNavigate()
//   const { name, contestant_number } = useParams();
//   const { state } = useLocation()
//   const { data: contestants, isLoading, error } = useContestants();






  
//   console.log(contestants)
  
//   const candidateFromState = state?.contestant
//    const candidate = contestants?.find(
//       (c) =>
//         c.fullname.toLowerCase().replace(/\s+/g, "-") === name &&
//         String(c.contestant_number) === String(contestant_number)
//     );
//   const parsedName = name
//     .replaceAll("-", " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());
//     console.log(parsedName, contestant_number)

//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1); // 1 = user info, 2 = payment details
//   const [userInfo, setUserInfo] = useState({ fullName: "", email: "", numberOfVotes: "" });
//   const [accountDetails, setAccountDetails] = useState(null);
//   const [generatingAccountNumberLoader, setGeneratingAccountNumberLoader] = useState(false)

  
//   const handleChange = (e) => {
//     setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
//   };

//   const validateFullName = (name) => {
//     const words = name.trim().split(/\s+/);
//     if (words.length < 2) return false;
//     const wordRegex = /^[A-Za-z'-]{2,}$/;
//     return words.every((word) => wordRegex.test(word));
//   };

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleNextStep = async () => {
//     if (!validateFullName(userInfo.fullName)) {
//       toast.error("Please enter a valid full name (first and last name).");
//       return;
//     }
//     if (!validateEmail(userInfo.email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }
//     if (!userInfo.numberOfVotes || !userInfo.numberOfVotes > 0) {
//       toast.error("Please enter a valid number of votes.");
//       return;
//     }

//     try {
//       setGeneratingAccountNumberLoader(true)

//       // 🔹 Example API call
//       const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate-dynamic-account-number`, {
//         fullName: userInfo.fullName,
//         email: userInfo.email,
//         numberOfVotes: userInfo.numberOfVotes,
//         contestantName: candidate.fullname,
//         contestantNumber: candidate.contestant_number,
//       });

//       // if (!response.ok) throw new Error("Failed to generate account number");
//       console.log(feedback)
//       if(feedback.data.code === "success"){
//         setAccountDetails({
//           bank: feedback.data.data.bank,
//           accountName: feedback.data.data.accountName,
//           accountNumber: feedback.data.data.accountNumber,
//         });

//         setStep(2);
//       }

//       // const data = await response.json();
      
      
//       // toast.success("Account details ready!");
//     } catch (err) {
//       console.error(err);
//       toast.error("An error occurred while retrieving account details. Please try again.");
//     }finally{
//       setGeneratingAccountNumberLoader(false)
//     }
//   };

  
//   const handleCopy = () => {
//     navigator.clipboard.writeText(accountDetails.accountNumber);
//     toast.success("Account number copied!");
//   };
//   useEffect(() => {
//     if (!isLoading && !candidate && !error) {
//       navigate("/page-not-found", { replace: true });
//     }
//   }, [isLoading, candidate, error, navigate]);
  
//     if (isLoading) return;
//   if (error) return <h1 className="alert alert-danger">Error loading contestants</h1>;
//   // Guard against undefined candidate
// if (!candidate) return <h1>Candidate not found...</h1>;
//   return (
//     <div className="vote-component-container">
//       <Navbar />
//       {generatingAccountNumberLoader && <Loader />}

//       <div className="vote-page-content">
//         {/* Candidate Image */}
//         <div className="candidate-image-section">
//           <img
//             src={candidate.image}
//             alt={candidate.name}
//             className="candidate-image"

//           />
//         </div>

//         {/* Candidate Details */}
//         <div className="candidate-details-section">
//           <h1 className="candidate-name">{candidate.fullname}</h1>
//           <p className="contestant-desc" style={{fontFamily: "'Orbitron', sans-serif", fontSize: "20px"}}>
//                 Contestant Number {String(candidate.contestant_number).padStart(2, "0")}
//               </p>
//           <div className="vote-action-box">
//             <div className="crown-icon-wrapper">
//               <i className="fa fa-crown"></i>
//             </div>

//             <h2 className="vote-heading">
//               VOTE FOR {candidate.fullname.toUpperCase()}
//             </h2>
//             <p className="vote-subtext">Each vote costs ₦100</p>

//             <button
//               className="cast-vote-btn"
//               onClick={() => {
//                 setShowModal(true);
//                 setStep(1);
//               }}
//             >
//               CAST YOUR VOTE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {/* {showModal && ( */}
//         {/* <div
//           className="payment-modal-overlay"
//           onClick={() => setShowModal(false)}
//         > */}
//         <div
//   className={`payment-modal-overlay ${showModal ? "show" : "hide"}`}
//   onClick={() => setShowModal(false)} // clicking overlay closes modal
// >
//           <div
//             className="vote-component-payment-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="close-modal-btn"
//               onClick={() => setShowModal(false)}
//             >
//               &times;
//             </button>










//                 {/* VOTING MODAL */}















//             {/* Step 1: User Info */}
//             {step === 1 && (
//               <div className="user-info-form">
//                 <div className="modal-crown-wrapper">
//                   <i className="fa fa-crown"></i>
//                 </div>

//                 <h2 className="modal-vote-heading">
//                   VOTE FOR {candidate.fullname.toUpperCase()}
//                 </h2>
//                 <hr className="modal-underline" />

//                 <div className="modal-candidate-info">
//                 <img src={candidate.image} alt={candidate.fullname} className="modal-candidate-image" />
                  
//                   <div className="modal-candidate-text">
//                     <h4 style={{ color: "white" }}>{candidate.fullname}</h4>
//                     <p>Vote Price: ₦100 each</p>
//                   </div>
//                 </div>
//                 <hr className="modal-underline" />

//                 <input
//                   type="text"
//                   name="fullName"
//                   placeholder="Full name"
//                   value={userInfo.fullName}
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={userInfo.email}
//                   onChange={handleChange}
//                 />
//                 <p className="email-note">
//                   Please input your valid email address as a receipt of your vote will be sent.
//                 </p>

//                 <input
//                   type="text"
//                   name="numberOfVotes"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
//                   placeholder="Number of votes"
//                   value={userInfo.numberOfVotes}
//                   onChange={handleChange}
//                 />

//                 <button className="next-step-btn" onClick={handleNextStep}>
//                   Proceed to Payment
//                 </button>
//               </div>
//             )}











//                 {/* PAYMENT MODAL */}






//             {/* Step 2: Payment Details */}
//             {step === 2 && accountDetails && (
//               <div className="payment-details">
//                 <h2 style={{color: "white"}}>Bank Transfer Details</h2>
//                 <p>Please make your payment using the account details below:</p>

//                 <div className="account-details">
//                   <p>
//                     <strong>Bank:</strong> {accountDetails.bank}
//                   </p>
//                   <p>
//                     <strong>Account Name:</strong> {accountDetails.accountName}
//                   </p>
//                   <p>
//                     <strong>Account Number:</strong>{" "}
//                     <span className="account-number">
//                       {accountDetails.accountNumber}
//                     </span>
//                   </p>
//                   <button className="copy-btn" onClick={handleCopy}>
//                     Copy Account Number
//                   </button>
//                 </div>

//                 {/* <p className="modal-note">
//                   After making your transfer, please confirm your payment on
//                   this page.
//                 </p> */}
//               </div>
//             )}
//           </div>
//         </div>
//       {/* )} */}

//       <Footer />
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </div>
//   );
// };

// export default VoteForCandidate;