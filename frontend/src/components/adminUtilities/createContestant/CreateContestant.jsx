import { useState } from "react";
import "./createContestant.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toastError,toastSuccess } from "../../toast/toast";
import Loader from "../../loader/Loader";

const CreateContestant = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    contestantNumber: "",
    email: "",
    image: null,
  });
  const [pageLoading, setPageLoading] = useState(false)

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

     if (name === "contestantNumber") {
    // Allow user to clear the input
    if (value === "") {
      setFormData((prev) => ({ ...prev, contestantNumber: "" }));
      return;
    }

    const num = parseInt(value, 10);
    // Prevent negative or zero numbers
    if (isNaN(num) || num < 1) return;
  }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
    
  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    const token = Cookies.get("authToken");
    console.log("Submitting contestant:", formData);
    // Your API call here
    setShowPreview(false);
    setPageLoading(true)


    const uploadData = new FormData();
    uploadData.append("fullname", formData.fullname);
    uploadData.append("contestantNumber", formData.contestantNumber);
    uploadData.append("email", formData.email);
    uploadData.append("image", formData.image);

    try{
      const feedback = await axios.post(
          // console.log(uploadData)
          `${import.meta.env.VITE_BACKEND_URL}/admin/add-contestant`, 
          uploadData,
          {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
              }
          }
      );
      console.log(feedback)
      if(feedback.data.code == "success"){
        toastSuccess(feedback.data.message)
          // ✅ Clear form fields after success
        setFormData({
          fullname: "",
          contestantNumber: "",
          email: "",
          image: null,
        });

        // Optionally reset file input visually
        const fileInput = document.querySelector('input[name="image"]');
        if (fileInput) fileInput.value = "";

      }else if (feedback.data?.errors) {
        const errors = feedback.data.errors;
        const firstKey = Object.keys(errors)[0]; // get the first error field name dynamically
        const firstErrorMessage = errors[firstKey][0]; // get its first message
        toastError(firstErrorMessage);
      }
      
      
      else{
        toastError(feedback.data.message || 'An Error Occurred. Please retry')
      }
    }catch(error){
      toastError('An Error Occurred. Please retry')
    }finally {
      setPageLoading(false);
    }
  };

  return (
    <div className="create-contestant-page">
      {pageLoading && <Loader />}
      <form className="contestant-form" onSubmit={handlePreview}>
        <div className="form-crown-wrapper">
          <i className="fa fa-crown"></i>
        </div>

        <h2 className="form-title">Add New Contestant</h2>
        <hr className="form-underline" />

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter Full Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Contestant Number</label>
          <input
            type="text" // change from number to text for full control
            name="contestantNumber"
            value={formData.contestantNumber}
            onChange={(e) => {
              const value = e.target.value;

              // Only allow digits
              if (/^\d*$/.test(value)) {
                setFormData((prev) => ({
                  ...prev,
                  contestantNumber: value,
                }));
              }
            }}
            placeholder="Enter Contestant Number"
            required
          />

        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Show Preview
        </button>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="preview-modal-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="preview-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-close-modal-btn"
              onClick={() => setShowPreview(false)}
            >
              &times;
            </button>

            <div className="preview-card">
              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Profile Preview"
                  className="preview-image"
                />
              )}
              <h3>{formData.fullname}</h3>
              <p><strong>Contestant Number {formData.contestantNumber}</strong></p>
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
              Add Contestant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContestant;



















