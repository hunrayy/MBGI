import { useState, useEffect } from "react"
import localforage from "localforage"
import axios from "axios"
import Home from "./pages/home/Home"
import Cart from "./pages/cart/Cart"
import Login from "./pages/login/Login"
import Identification from "./pages/identification/Identification"
import Register from "./pages/register/Register"
import SingleProduct from "./pages/singleProduct/singleProduct"
import { Route, Routes, useLocation } from "react-router-dom"
import CartProvider from "./pages/cart/CartContext"
import PageNotFound from "./pages/pageNotFound/PageNotFound"
import AdminDashboard from "./pages/adminDashboard/AdminDashboard"
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess"
import AdminLogin from "./pages/adminLogin/AdminLogin"
import VerifyEmailCode from "./pages/verifyEmailCode/VerifyEmailCode"
import ForgotPassword from "./pages/forgotPassword/ForgotPassword"
import ResetPassword from "./pages/resetPassword/ResetPassword"
import ContactUs from "./pages/contactUs/ContactUs"
import { AuthProvider } from "./components/AuthContext/AuthContext"
import CheckOut from "./pages/checkOut/CheckOut"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import UserAccount from "./pages/userAccount/UserAccount"
import AllProducts from "./pages/allProducts/AllProducts"
import AdminForgotPassword from "./pages/adminForgotPassword/AdminForgotPassword"
import AdminResetPassword from "./pages/adminResetPassword/AdminResetPassword"
import TrackingPage from "./pages/trackingPage/trackingPage"
import Policies from "./pages/policies/Policies"
import VoteForCandidate from "./pages/voteForCandidate/VoteForCandidate"
import { Toaster } from "sonner";
import PaystackPaymentModal from "./components/paystackPaymentModal/PaystackPaymentModal"
// import PaymentVerification from "./pages/paymentVerification/PaymentVerification"
// import PaymentSuccessModal from "./pages/paymentSucessModal/PaymentVerification"
import PaymentVerification from "./pages/PaymentVerification/PaymentVerification"
function App() {
  
  
const dynamicRoute = import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE


  return (
    <>
      <AuthProvider>
        <CartProvider>
                <Toaster
        position="top-right"
        toastOptions={{
          style: {
            // zIndex: 99999,
            backgroundColor: "#fff",
            color: "#000",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            paddingTop: "20px",
            paddingBottom: "20px",
          },  
        }}
      />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vote-for/:name/contestant-number/:contestant_number" element={<VoteForCandidate />} />
            <Route path={"verify-payment"} element={<PaymentVerification />} />
            <Route path="/MBGI/Celestial/Emberstone/admin/login" element={<AdminLogin />} />
            <Route path={`/admin/dashboard/${dynamicRoute}`} element={<AdminDashboard />} />
            <Route path="*" element={<PageNotFound />} />






















            <Route path="/collections/all" element={<AllProducts />} />
            <Route path="/product/:productId" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/checkout" element={<CheckOut />} />
            <Route path="/payment-status" element={<PaymentSuccess />} />
            <Route path="/identification/" element={<Identification />} />
            <Route path="/email-verification/:token" element={<VerifyEmailCode />} />
            <Route path="/login" element={<Login />} />
            <Route path="/accounts/password/reset" element={<ForgotPassword />} />
            <Route path='/accounts/password/reset/reset-password/:token' element={<ResetPassword />} />
            <Route path="/user-account" element={<UserAccount />} />
            <Route path="/register/:token" element={<Register />} />
            <Route path="/order/tracking" element={<TrackingPage />} />
            <Route path="/pages/contact" element={<ContactUs />} />
            <Route path="/policies/:policy" element={<Policies />} />
            <Route path="/accounts/password/reset/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJIZW5yeSIsImxhc3RuY" element={<AdminForgotPassword />} />
            <Route path="/admin/accounts/password/reset/reset-password/:token" element={<AdminResetPassword />} />
            <Route path="/page-not-found" element={<PageNotFound />} />
          </Routes>
          {/* <ToastContainer /> */}
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App

































// import { useState, useEffect } from "react"
// import localforage from "localforage"
// import axios from "axios"
// import Home from "./pages/home/Home"
// import Cart from "./pages/cart/Cart"
// import Login from "./pages/login/Login"
// import Identification from "./pages/identification/Identification"
// import Register from "./pages/register/Register"
// import SingleProduct from "./pages/singleProduct/singleProduct"
// import { Route, Routes, useLocation } from "react-router-dom"
// import CartProvider from "./pages/cart/CartContext"
// import PageNotFound from "./pages/pageNotFound/PageNotFound"
// import AdminDashboard from "./pages/adminDashboard/AdminDashboard"
// import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess"
// import AdminLogin from "./pages/adminLogin/AdminLogin"
// import VerifyEmailCode from "./pages/verifyEmailCode/VerifyEmailCode"
// import ForgotPassword from "./pages/forgotPassword/ForgotPassword"
// import ResetPassword from "./pages/resetPassword/ResetPassword"
// import ContactUs from "./pages/contactUs/ContactUs"
// import { AuthProvider } from "./components/AuthContext/AuthContext"
// import CheckOut from "./pages/checkOut/CheckOut"
// import { ToastContainer } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css'
// import UserAccount from "./pages/userAccount/UserAccount"
// import AllProducts from "./pages/allProducts/AllProducts"
// import AdminForgotPassword from "./pages/adminForgotPassword/AdminForgotPassword"
// import AdminResetPassword from "./pages/adminResetPassword/AdminResetPassword"
// import TrackingPage from "./pages/trackingPage/trackingPage"
// import Policies from "./pages/policies/Policies"
// import VoteForCandidate from "./pages/voteForCandidate/VoteForCandidate"
// import { Toaster } from "sonner";
// import PaystackPaymentModal from "./components/paystackPaymentModal/PaystackPaymentModal"
// function App() {
  
  
// const dynamicRoute = import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE

//   const location = useLocation();
//   const state = location.state;

//   return (
//     <>
//       <AuthProvider>
//         <CartProvider>
//                 <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             // zIndex: 99999,
//             backgroundColor: "#fff",
//             color: "#000",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             paddingTop: "20px",
//             paddingBottom: "20px",
//           },  
//         }}
//       />

//           <Routes location={state?.background || location}>
//             <Route path="/" element={<Home />} />
//             <Route path="/vote-for/:name/contestant-number/:contestant_number" element={<VoteForCandidate />} />
//             {/* Paystack payment modal route */}
//             <Route
//               path="/vote-for/:name/contestant-number/:contestant_number/payment"
//               element={<PaystackPaymentModal />}
//             />
//             <Route path="/MBGI/Celestial/Emberstone/admin/login" element={<AdminLogin />} />
//             <Route path={`/admin/dashboard/${dynamicRoute}`} element={<AdminDashboard />} />
//             <Route path="*" element={<PageNotFound />} />






















//             <Route path="/collections/all" element={<AllProducts />} />
//             <Route path="/product/:productId" element={<SingleProduct />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/products/checkout" element={<CheckOut />} />
//             <Route path="/payment-status" element={<PaymentSuccess />} />
//             <Route path="/identification/" element={<Identification />} />
//             <Route path="/email-verification/:token" element={<VerifyEmailCode />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/accounts/password/reset" element={<ForgotPassword />} />
//             <Route path='/accounts/password/reset/reset-password/:token' element={<ResetPassword />} />
//             <Route path="/user-account" element={<UserAccount />} />
//             <Route path="/register/:token" element={<Register />} />
//             <Route path="/order/tracking" element={<TrackingPage />} />
//             <Route path="/pages/contact" element={<ContactUs />} />
//             <Route path="/policies/:policy" element={<Policies />} />
//             <Route path="/accounts/password/reset/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJIZW5yeSIsImxhc3RuY" element={<AdminForgotPassword />} />
//             <Route path="/admin/accounts/password/reset/reset-password/:token" element={<AdminResetPassword />} />
//             <Route path="/page-not-found" element={<PageNotFound />} />
//           </Routes>
//           {/* Modal overlay route */}
//         {state?.background && (
//           <Routes>
//             <Route
//               path="/vote-for/:name/contestant-number/:contestant_number/payment"
//               element={<PaystackPaymentModal isModal />}
//             />
//           </Routes>
//         )}

//         {/* Direct access to /payment (refresh) */}
//         <Routes>
//           <Route
//             path="/vote-for/:name/contestant-number/:contestant_number/payment"
//             element={<PaystackPaymentModal />}
//           />
//         </Routes>
//           {/* <ToastContainer /> */}
//         </CartProvider>
//       </AuthProvider>
//     </>
//   )
// }

// export default App
