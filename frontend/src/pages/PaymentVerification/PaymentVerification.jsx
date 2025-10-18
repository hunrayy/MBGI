import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './paymentVerification.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';

const PaymentVerification = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const modalRef = useRef();
  const location = useLocation();

  const [paymentStatus, setPaymentStatus] = useState({
    status: '',      // success, already-processed, error
    message: '',     // backend message
    votes_awarded: 0 // from backend
  });
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const trxref = queryParams.get('trxref');
    const reference = queryParams.get('reference');

    if (trxref || reference) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-payment`, { reference: trxref || reference })
        .then(res => {
          console.log('Verification response:', res.data);
          setPaymentStatus({
            status: res.data.status,
            message: res.data.message,
            votes_awarded: res.data.data?.votes_awarded || 0
          });

          // 🎉 Trigger confetti only on first success
          if (res.data.status === 'success') {
            runConfetti();
          }
        })
        .catch(err => {
          console.error('Verification error:', err);
          setPaymentStatus({
            status: 'error',
            message: 'Unable to verify payment at this time.'
          });
        }).finally(() => {
          setVerifying(false);
        });
    }
  }, [location.search]);

  const runConfetti = () => {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        zIndex: 10000
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        zIndex: 10000
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderTitle = () => {
    switch (paymentStatus.status) {
      case 'success':
        return '🎉 Vote Successful!';
      case 'already-processed':
        return 'Transaction Already Processed!';
      case 'error':
        if (paymentStatus.message === 'Invalid payment reference.') {
          return 'Invalid Payment Reference!';
        } else if (paymentStatus.message === 'Transaction not successful.') {
          return 'Transaction Not Successful!';
        } else {
          return 'Payment Verification Pending!';
        }
      default:
        return 'Verifying Payment...';
    }
  };

  if(verifying) return <Loader />

  return (
    <div className="payment-modal-backdrop active" ref={modalRef}>
      <div className="payment-modal">
        {/* <div className="success-icon">
          {paymentStatus.status === 'success' ? (
            ) : paymentStatus.status === 'already-processed' ? (
              ) : paymentStatus.status === 'error' ? (
                ) : (
                   */}

        <div className={
  paymentStatus.status === 'success' ? 'success-icon' : 'static-icon'
}>
  {paymentStatus.status === 'success' ? (
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M7 13l3 3 7-7" />
                  </svg>
  ) : paymentStatus.status === 'already-processed' ? (
                <svg className="already-processed-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#999" fill="none" />
                <path d="M12 6v6l4 2" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
  ) : paymentStatus.status === 'error' ? (
                  <svg className="error-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="red" fill="none" />
                  <line x1="8" y1="8" x2="16" y2="16" stroke="red" />
                  <line x1="16" y1="8" x2="8" y2="16" stroke="red" />
                  </svg>
  ) : (
    <svg className="pending-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#ccc" />
                  </svg>
              
  )}
</div>


        <h2>{renderTitle()}</h2>
        {/* <p className="payment-message">
          {paymentStatus.message || 'Payment Is Being Verified'}
        </p> */}

        {paymentStatus.status === 'success' && (
          <p> Thanks for voting! A receipt of your vote has been sent to your email. Your support brings your favorite contestant one step closer to victory. </p>
        )}

        {/* <p className="payment-footer">
          Thanks for voting! Your support brings your favorite contestant one step closer to victory.
        </p> */}

        <button className="payment-btn" onClick={() => navigate('/', { replace: true })}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentVerification;


























// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import confetti from 'canvas-confetti';
// import './paymentSuccessModal.css';
// import { useLocation, useNavigate } from 'react-router-dom';

// const PaymentSuccessModal = ({ isOpen = true }) => {
//     const navigate = useNavigate()
//   const modalRef = useRef();


//   const location = useLocation();

//   useEffect(() => {
//     // 1️⃣ Extract query parameters
//     const queryParams = new URLSearchParams(location.search);
//     const trxref = queryParams.get('trxref');     
//     const reference = queryParams.get('reference'); 

//     const [paymentStatus, setPaymentStatus] = useState({
//       status: '',    // 'success', 'already_processed', 'error', etc.
//       message: '',   // text message from backend
//       votes_awarded: 0, // optional, from backend
//     });


//     console.log('trxref:', trxref, 'reference:', reference);

//     // 2️⃣ Send to backend for verification
//     if (trxref || reference) {
//       axios.post('/api/verify-payment', { reference: trxref || reference })
//         .then(res => {
//           console.log('Verification response:', res);
//           setPaymentStatus(res.data.data);
//           // Run confetti only if it's success
//           if (res.data.status === 'success' && res.data.message === 'Transaction successful.') {
//             runConfetti();
//           }

//         })
//         .catch(err => {
//           console.error('Verification error:', err);
//           setPaymentStatus({
//             status: 'error',
//             message: 'Unable to verify payment at this time.',
//           });
//         });
//     }
//   }, [location.search]);


  

//   const runConfetti = () => {
//     const duration = 1000;
//     const end = Date.now() + duration;

//     (function frame() {
//       confetti({
//         particleCount: 7,
//         angle: 60,
//         spread: 100,
//         origin: { x: 0 },
//         zIndex: 10000
//       });
//       confetti({
//         particleCount: 7,
//         angle: 120,
//         spread: 100,
//         origin: { x: 1 },
//         zIndex: 10000
//       });

//       if (Date.now() < end) {
//         requestAnimationFrame(frame);
//       }
//     })();
//   };

//   React.useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//       runConfetti();
//     }else{
//       document.body.style.overflow = '';
//     }

//       // Clean up just in case
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="payment-modal-backdrop active" ref={modalRef}>
//       <div className="payment-modal">
//         <div className="success-icon">
//           <svg viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="10" />
//             <path d="M7 13l3 3 7-7" />
//           </svg>
//         </div>
//         <h2>Vote Successful!</h2>
//         <p>
//           Thanks for voting! A confirmation of your vote has been sent to your email. 
//           Your support brings your favorite contestant one step closer to victory.
//         </p>
//         <button className="payment-btn" onClick={()=> navigate('/', {replace: true})}>Back to home</button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessModal;
