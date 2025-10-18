import React, { useState, useEffect } from "react";
import Logo from "../../components/Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { useAuth } from "../../components/AuthContext/AuthContext";
import axios from "axios";
import "./adminLogin.css"
import { toast } from "sonner";
import { toastError } from "../../components/toast/toast";
const AdminLogin = () => {

  const navigate = useNavigate();
  const { user, loading, loginUser } = useAuth();
  const [pageLoading, setPageLoading] = useState(false)

  
useEffect(() => {
  if (!loading && user.is_user_logged) {
    if (user.user?.user === "admin" && user.user?.is_an_admin === 1) {
      navigate(`/admin/dashboard/${import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }
}, [user, loading, navigate]);

// Block render while auth is still loading
if (loading) {
  return null; // Or <Loader />
}

// Prevent showing login form if already logged in
if (user.is_user_logged) {
  return null;
}


 const handleGoogleLogin = () => {
    if (!window.google) {
      toast.error("We're having trouble connecting to Google. Please refresh the page and try again.");
      return;
    }

    // Initialize Google OAuth client
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Replace this
      scope: "email profile openid",
      callback: async (response) => {
        setPageLoading(true); // <-- show loader right when popup closes
        try {
          // Send token to backend
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/google-login`, {
            token: response.access_token,
          });
          console.log(res)

          if (res.data.code == "success") {
            // Save authenticated user
            const adminDetails = res.data.data
            loginUser(adminDetails)
          
          } else {
            toastError(res.data.message || "Login failed")
          }
        } catch (err) {
          console.log("Google login error:", err);
            toastError("An error occurred while logging in.")
        }finally {
        setPageLoading(false); // <-- hide loader after request completes
      }
      },
    });

    // Trigger popup
    client.requestAccessToken();
  };

  return (
  <div>
    {pageLoading && <Loader />}
    <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
      <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
    </div>

    <div className="login-page-container">
      <div className="login-page-wrapper">
        <Logo />
        <h3>Welcome Back!</h3>

        <div style={{ padding: "30px" }}>
          {/* Google OAuth Button */}
          <div className="d-grid">
            <button
              // className="btn btn-lg mt-4 admin-google-oauth-btn"
              className="mt-4 admin-google-oauth-btn"
              type="button"
              onClick={handleGoogleLogin} // your OAuth handler
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google Logo"
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "10px",
                }}
              />
              <b>Continue with Google</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default AdminLogin;











































// import React, { useState, useEffect } from "react";
// import Logo from "../../components/Logo/Logo";
// import { Link, useNavigate } from "react-router-dom";
// import Loader from "../../components/loader/Loader";
// import { useAuth } from "../../components/AuthContext/AuthContext";
// import axios from "axios";

// const AdminLogin = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     errors: {},
//     loading: false,
//   });
//   const [serverErrorFeedback, setServerErrorFeedback] = useState({
//     status: false,
//     message: ""
//   })
//   const navigate = useNavigate();
//   const use_auth = useAuth()

//   useEffect(()=> {
//     //navigate to home page if current user is loggedin
//     use_auth.user.is_user_logged && navigate('/', {replace: true})

//   })

//   const validateForm = () => {
//     const errors = {};
//     // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!formData.email) {
//       errors.email = "Email is required.";
//     } 
//     // else if (!emailPattern.test(formData.email)) {
//     //   errors.email = "Invalid email format.";
//     // }

//     if (!formData.password) {
//       errors.password = "Password is required.";
//     } 

//     return errors;
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//       errors: { ...formData.errors, [e.target.name]: "" }, // Clear error on change
//     });
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     const errors = validateForm();

//     if (Object.keys(errors).length === 0) {
//       // clear the form data and submit the form
//       setFormData({
//         email: "",
//         password: "",
//         errors: {},
//         loading: true
//       })
//       setServerErrorFeedback({status: false, message: ""})
//       const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {email: formData.email, password: formData.password})
//       console.log(feedback)
//       if(feedback){
//         setFormData((prev) => ({
//           ...prev,
//           loading: false
//         }))
//         if(feedback.data.code === "error"){
//           setServerErrorFeedback({status: true, message: feedback.data.message})
//         }else if(feedback.data.code === "success"){
//           const adminDetails = feedback.data.data
//           use_auth.loginUser(adminDetails)
//         }
//       }
//     } else {
//       setFormData({ ...formData, errors });
//     }
//   };
//   // Conditionally render the login form only if the user is not logged in
//   if (use_auth.user.is_user_logged) {
//     return null; // Don't render anything if user is logged in, navigate will handle it
//   }

//   return (
//     <div>
//         { formData.loading && <Loader /> }
//       <div style={{ padding: "20px", fontSize: "20px" }} className="d-md-none">
//         <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
//       </div>
//       <div className="login-page-container">
//         <div className="login-page-wrapper">
//           <Logo />
//           <h3>Welcome Back!</h3>
//           <form className="mb-1" onSubmit={handleSubmit}>
//             <div style={{ padding: "30px" }}>
//             {serverErrorFeedback.status && <div className="alert alert-danger">{serverErrorFeedback.message}</div>}
//               <div className="form-floating">
//                 <input
//                   type="text    "
//                   name="email"
//                   placeholder="Email"
//                   style={{fontSize: "16px"}}
//                   className={`form-control form-control-lg ${
//                     formData.errors.email ? "is-invalid" : ""
//                   }`}
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//                 <label>Email</label>
//                 {formData.errors.email && (
//                   <div className="invalid-feedback" style={{textAlign: "left"}}>
//                     {formData.errors.email}
//                   </div>
//                 )}
//               </div>

//               <div className="form-floating mt-3">
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   className={`form-control form-control-lg ${
//                     formData.errors.password ? "is-invalid" : ""
//                   }`}
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 <label>Password</label>
//                 {formData.errors.password && (
//                   <div className="invalid-feedback" style={{textAlign: "left"}}>
//                     {formData.errors.password}
//                   </div>
//                 )}
//               </div>
//               <div style={{textAlign: "right", marginTop: "20px"}} >
//                 <small><Link  to="/accounts/password/reset/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJIZW5yeSIsImxhc3RuY" style={{textDecoration: "none", color: "purple"}}>Forgot Password?</Link></small>
                
//               </div>

//               <div className="d-grid">
//                 <button className="btn btn-lg mt-4" type="submit" style={{background: "purple", color: "white"}}>
//                   <b>Login</b>
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
