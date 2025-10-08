import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./voteForCandidate.css";
// import image from "../../../public/testContestantImage.jpeg"
import image from "../../../public/testContestantImage.jpeg"

const VoteForCandidate = () => {
  const { name } = useParams();
  const parsedName = name
    .replaceAll("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1 = user info, 2 = payment details
  const [userInfo, setUserInfo] = useState({ fullName: "", email: "" });
  const [accountDetails, setAccountDetails] = useState(null);

  const candidate = {
    // image:
    //   "https://www.vote.missonenigeria.com/storage/contestants/1758742129_precious-mohammed.jpeg",
      image: image,
    name: parsedName,
    bio: "A confident, kind, and ambitious young woman passionate about community growth and empowering others.",
  };

  // Preload candidate image to prevent re-download
  const candidateImage = (
    <img
      src={candidate.image}
      alt={candidate.name}
      className="modal-candidate-image"
    />
  );

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

  const handleNextStep = () => {
    if (!validateFullName(userInfo.fullName)) {
      toast.error("Please enter a valid full name (first and last name).");
      return;
    }
    if (!validateEmail(userInfo.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Generate account details (replace with real API)
    setAccountDetails({
      bank: "Flutterwave Bank",
      accountName: `Most Beautiful Girl in Iba - ${candidate.name}`,
      accountNumber: "2038173926",
    });
    setStep(2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accountDetails.accountNumber);
    toast.success("Account number copied!");
  };

  return (
    <div className="vote-component-container">
      <Navbar />

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
          <h1 className="candidate-name">{candidate.name}</h1>
          <span>Contestant Number 06</span>
          {/* <p className="candidate-info">
            <strong>
              <i className="fa fa-cake"></i>
            </strong>
            &nbsp;&nbsp;&nbsp; {candidate.age} years old
          </p> */}
          <p className="candidate-bio">{candidate.bio}</p>

          <div className="vote-action-box">
            <div className="crown-icon-wrapper">
              <i className="fa fa-crown"></i>
            </div>

            <h2 className="vote-heading">
              VOTE FOR {candidate.name.toUpperCase()}
            </h2>
            <p className="vote-subtext">Each vote costs ₦200</p>

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

            {/* Step 1: User Info */}
            {step === 1 && (
              <div className="user-info-form">
                <div className="modal-crown-wrapper">
                  <i className="fa fa-crown"></i>
                </div>

                <h2 className="modal-vote-heading">
                  VOTE FOR {candidate.name.toUpperCase()}
                </h2>
                <hr className="modal-underline" />

                <div className="modal-candidate-info">
                  {candidateImage}
                  <div className="modal-candidate-text">
                    <h4 style={{ color: "white" }}>{candidate.name}</h4>
                    <p>Vote Price: ₦200 each</p>
                  </div>
                </div>
                <hr className="modal-underline" />

                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
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
                <button className="next-step-btn" onClick={handleNextStep}>
                  Proceed to Payment
                </button>
              </div>
            )}

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




























// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../../components/navbar/Navbar";
// import Footer from "../../components/footer/Footer";
// import "./voteForCandidate.css";

// const VoteForCandidate = () => {
//   const { name } = useParams();
//   const parsedName = name
//     .replaceAll("-", " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1); // 1 = user info, 2 = payment details
//   const [userInfo, setUserInfo] = useState({ fullName: "", email: "" });
//   const [accountDetails, setAccountDetails] = useState(null);

//   const candidate = {
//     image:
//       "https://www.vote.missonenigeria.com/storage/contestants/1758742129_precious-mohammed.jpeg",
//     name: parsedName,
//     age: 22,
//     location: "Iba, Lagos",
//     bio: "A confident, kind, and ambitious young woman passionate about community growth and empowering others.",
//   };

//   const handleChange = (e) => {
//     setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
//   };

//   const generateAccountNumber = () => {
//     // Replace with real API call to generate account
//     setAccountDetails({
//       bank: "Flutterwave Bank",
//       accountName: `Most Beautiful Girl in Iba - ${candidate.name}`,
//       accountNumber: "2038173926",
//     });
//     setStep(2);
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(accountDetails.accountNumber);
//     alert("Account number copied!");
//   };

//   return (
//     <div className="vote-component-container">
//       <Navbar />

//       <div className="vote-page-content">
//         <div className="candidate-image-section">
//           <img
//             src={candidate.image}
//             alt={candidate.name}
//             className="candidate-image"
//           />
//         </div>

//         <div className="candidate-details-section">
//           <h1 className="candidate-name">{candidate.name}</h1>
//           <p className="candidate-info">
//             <strong><i className="fa fa-cake"></i></strong>&nbsp;&nbsp;&nbsp; {candidate.age} years old
//           </p>
//           <p className="candidate-bio">{candidate.bio}</p>

//           <div className="vote-action-box">
//             <div className="crown-icon-wrapper">
//               <i className="fa fa-crown"></i>
//             </div>

//             <h2 className="vote-heading">VOTE FOR {candidate.name.toUpperCase()}</h2>
//             <p className="vote-subtext">Each vote costs ₦200.00</p>

//             <button
//               className="cast-vote-btn"
//               onClick={() => { setShowModal(true); setStep(1); }}
//             >
//               CAST YOUR VOTE
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="payment-modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="vote-component-payment-modal" onClick={(e) => e.stopPropagation()}>
//             <button className="close-modal-btn" onClick={() => setShowModal(false)}>&times;</button>

//             {/* Step 1: User info */}
//             {step === 1 && (
//             <div className="user-info-form">
//                 {/* Crown */}
//                 <div className="modal-crown-wrapper">
//                 <i className="fa fa-crown"></i>
//                 </div>

//                 {/* Heading */}
//                 <h2 className="modal-vote-heading">VOTE FOR {candidate.name.toUpperCase()}</h2>
//                 <hr className="modal-underline" />

//                 {/* Candidate mini info */}
//                 <div className="modal-candidate-info">
//                 <img
//                     src={candidate.image}
//                     alt={candidate.name}
//                     className="modal-candidate-image"
//                 />
//                 <div className="modal-candidate-text">
//                     <h4 style={{color: "white"}}>{candidate.name}</h4>
//                     <p>Vote Price: ₦200.00 each</p>
//                 </div>
//                 </div>
//                 <hr className="modal-underline" />

//                 {/* Form Inputs */}
//                 <input
//                 type="text"
//                 name="fullName"
//                 placeholder="Full Name"
//                 value={userInfo.fullName}
//                 onChange={handleChange}
//                 />
//                 <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={userInfo.email}
//                 onChange={handleChange}
//                 />
//                 <p className="email-note">
//                 Please input your valid email address as a receipt of your vote will be sent.
//                 </p>
//                 <button
//                 className="next-step-btn"
//                 onClick={generateAccountNumber}
//                 disabled={!userInfo.fullName || !userInfo.email}
//                 >
//                 Proceed to Payment
//                 </button>
//             </div>
//             )}


//             {/* Step 2: Payment details */}
//             {step === 2 && accountDetails && (
//               <div className="payment-details">
//                 <h2>Bank Transfer Details</h2>
//                 <p>Please make your payment using the account details below:</p>

//                 <div className="account-details">
//                   <p><strong>Bank:</strong> {accountDetails.bank}</p>
//                   <p><strong>Account Name:</strong> {accountDetails.accountName}</p>
//                   <p><strong>Account Number:</strong> <span className="account-number">{accountDetails.accountNumber}</span></p>
//                   <button className="copy-btn" onClick={handleCopy}>Copy Account Number</button>
//                 </div>

//                 <p className="modal-note">
//                   After making your transfer, please confirm your payment on this page.
//                 </p>
//               </div>
//             )}

//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default VoteForCandidate;





























