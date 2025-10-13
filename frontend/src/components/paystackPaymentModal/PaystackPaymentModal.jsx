import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./paystackPaymentModal.css";
import Loader from "../loader/Loader";
import BasicLoader from "../loader/BasicLoader";
import { useContestants } from "../contestants/useContestants";
import PaymentSuccessModal from "../../pages/PaymentVerification/PaymentVerification"

const PaystackPaymentModal = ({ isModal }) => {
    const { refetchContestants } = useContestants();
  const { name, contestant_number } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    if (!state?.userInfo) {
      toast.error("Missing user info.");
      navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
      return;
    }

    const initializePaystack = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/generate-dynamic-account-number`,
          {
            fullName: state.userInfo.fullName,
            email: state.userInfo.email,
            numberOfVotes: state.userInfo.numberOfVotes,
            contestantName: state.contestantName,
            contestantNumber: contestant_number,
          },
            {
            timeout: 60000, // Wait up to 60 seconds (Paystack can be slow)
          }
        );
        console.log(data)

        if (data.code !== "success" || data.status == false) {
          toast.error(data.message || "Failed to initialize payment", { toastId: "init-error" });
          navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
          return;
        }

        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: state.userInfo.email,
          amount: data.data.amount,
          reference: data.data.reference,
//           callback: function (response) {
//   // Use a separate async function call INSIDE
//   refetchContestants()
//     .then(() => {
//       toast.success("Payment successful!");
//       navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
//     })
//     .catch((err) => {
//       console.error(err);
//       toast.error("Error updating votes");
//     });
// },

//           callback: async function (response) {
//   try {
//     await refetchContestants(); // ✅ refetch latest contestants
//     toast.success("Payment successful!");
//     navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
//   } catch (err) {
//     console.error(err);
//   }
// },

//           callback: function (response) {
//   (async () => {
//     try {
//       await refetchContestants(); // ✅ refetch latest contestants
//       setPaymentComplete(true);
//       navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
//     } catch (err) {
//       console.error(err);
//     }
//   })();
// },

// callback: function (response) {
//   (async () => {
//     try {
      
//       // Verify payment quietly in the background
//       const verifyRes = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/verify-payment`,
//         { reference: response.reference }
//       );
      
//       if (verifyRes.data.status === "success" || verifyRes.data.success) {
//         // Backend confirmed success
//         await refetchContestants();
//       } else {
//         // Backend could not confirm yet — log it
//         console.warn("Payment verification pending or failed:", verifyRes.data);
//         toast.info("Your payment is being verified. Votes may take a minute to update.");
//       }
//     } catch (err) {
//       console.error("Verification error:", err);
//       toast.info("Payment received but verification may take a while. We’re on it!");
//     }finally{
//       // Show optimistic success first
//       setPaymentComplete(true);
      
//     }
//   })();
// },

callback: function (response) {
  (async () => {
    try {
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify-payment`,
        { reference: response.reference }
      );

      const res = verifyRes.data;
      const isSuccess =
        res.status === "success" ||
        res.success === true ||
        res.code === "success" ||
        res.message?.includes("already processed");

      if (isSuccess) {
        await refetchContestants();
        toast.success("Payment successful!");
      } else {
        console.warn("Payment verification pending or failed:", res);
        toast.info("Your payment is being verified. Votes may take a minute to update.");
      }

      setPaymentComplete(true);
    } catch (err) {
      console.error("Verification error:", err);
      toast.info("Payment received but verification may take a while. We’re on it!");
            // ✅ Force React to re-render on main thread
      setTimeout(() => setPaymentComplete(true), 200);
      // setPaymentComplete(true); // ✅ still close the loader
    }
  })();
},


          onClose: function () {
            toast.info("Payment cancelled");
            navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
          },
        });

        console.log("⏰ Before openIframe:", new Date().toISOString());
        handler.openIframe();
        console.log("⏰ After openIframe:", new Date().toISOString());

      } catch (err) {
        console.error(err);
        toast.error("An error occurred while initializing payment", { toastId: "An-error-occurred-while-initializing-payment" });
        navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
      }
    };

    initializePaystack();
  }, [state, contestant_number, navigate, name]);


  if (!isModal) return null;

  return (
  <>
    {paymentComplete ? (
      <PaymentSuccessModal />
    ) : (
      <div className="paystack-payment-modal-overlay">
        <Loader />
      </div>
    )}
  </>
);


  // return (
  //   <div
  //     className="paystack-payment-modal-overlay"
  //     // onClick={() =>
  //     //   navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`)
  //     // }
  //   >
  //     {/* <div className="paystack-payment-modal-content">
  //       <h2>Processing Payment...</h2>
  //       <p>Paystack modal will open shortly. Click outside to cancel.</p>
  //     </div> */}
  //     {!paymentComplete && <Loader />}
  //   </div>
  // );
  
};


export default PaystackPaymentModal;
