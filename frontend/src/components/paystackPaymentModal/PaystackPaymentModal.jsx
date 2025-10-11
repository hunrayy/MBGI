import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./paystackPaymentModal.css";
import Loader from "../loader/Loader";
import BasicLoader from "../loader/BasicLoader";
import { useContestants } from "../contestants/useContestants";

const PaystackPaymentModal = ({ isModal }) => {
    const { refetchContestants } = useContestants();
  const { name, contestant_number } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

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
        //   callback: async function (response) {
        //     await queryClient.invalidateQueries(["contestants"]);
        //     toast.success("Payment successful!");
        //     navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
        //   },
          callback: function (response) {
  (async () => {
    try {
      await refetchContestants(); // ✅ refetch latest contestants
      toast.success("Payment successful!");
      navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
    } catch (err) {
      console.error(err);
    }
  })();
},

          onClose: function () {
            toast.info("Payment cancelled");
            navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
          },
        });

        handler.openIframe();
      } catch (err) {
        console.error(err);
        toast.error("Error initializing payment");
        navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`);
      }
    };

    initializePaystack();
  }, [state, contestant_number, navigate, name]);

  if (!isModal) return null;

  return (
    <div
      className="paystack-payment-modal-overlay"
      onClick={() =>
        navigate(state?.backgroundPath || `/vote-for/${name}/contestant-number/${contestant_number}`)
      }
    >
      {/* <div className="paystack-payment-modal-content">
        <h2>Processing Payment...</h2>
        <p>Paystack modal will open shortly. Click outside to cancel.</p>
      </div> */}
      <Loader />
    </div>
  );
};


export default PaystackPaymentModal;
