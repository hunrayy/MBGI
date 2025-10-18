
import { useState, useEffect } from "react";
import "./adminDashboard.css";
import AllContestants from "../../components/adminUtilities/allContestants/AllContestants";
import AdminHeader from "../../components/adminUtilities/adminHeader/AdminHeader";
import Dashboard from "../../components/adminUtilities/dashboard/Dashboard";
import CreateContestant from "../../components/adminUtilities/createContestant/CreateContestant";
import { useAuth } from "../../components/AuthContext/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import Select from 'react-select'


const AdminDashboard = () => {
    const use_auth = useAuth()
    const [shownav, setShownav] = useState(false);
    const [pages, setPages] = useState({
        dashboard_page: true,
        createContestant_page: false,
        allContestants_page: false,
        viewProducts_page: false,
        settings_page: false,
        notifications_page: false,
        shipping_policy_page: false,
        refund_policy_page: false,
        delivery_policy_page: false,
        pending_orders_page: false,
        out_for_delivery_page: false,
        delivered_orders_page: false,
        view_users: false,
        productCategory: false
    });

    // const [viewingUserType, setViewingUserType] = useState(null); // New state


    const toggleDropdown = (dropdownName) => {
      setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };

    const [policyPage, setPolicyPage] = useState(null)
    const showPage = (page) => {
        setPages({
            dashboard_page: page === 'dashboard',
            createContestant_page: page === 'createContestant',
            allContestants_page: page === 'allContestants',
        });
        setShownav(false);  // Close the sidebar when a page is selected
    };

    useEffect(()=> {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-product-categories`).then((feedback) => {
            console.log(feedback)
            if(feedback.data.code == 'error'){
                setCategories({
                    loading: false,
                    options: []
                })
                toast.error(`An error occured while fetching product categories: ${feedback.data.message}`)
            }else if(feedback.data.code == 'success'){
                // console.log(feedback)
                const categoryOptions = feedback.data.data.map(category => ({
                    value: category.id,  // Use the id as the value
                    label: category.name  // Use the name as the label
                }));
                setCategories({
                    loading: false,
                    options: categoryOptions
                })
            }else{
                setCategories({
                    loading: false,
                    options: []
                })
                toast.error('An error occured while retrieving product categories')
            }
        })
    }, [])
    

    return (
        <div>
            <AdminHeader shownav={shownav} setShownav={setShownav} />
            <div className="admin-page-container">
                <div className={shownav ? "admin-sidebar-black" : ""} onClick={() => { shownav ? setShownav(false) : null }}>
                    <div className={`admin-page-sidebar-container ${shownav ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: "10px", cursor: "pointer", width: "fit-content", fontSize: "20px" }} className="admin-cancel-menubar" onClick={() => setShownav(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className="admin-sidebar-icon-wrapper" onClick={() => showPage('dashboard')}>
                            <i className="fa-solid fa-desktop"></i> <span>Dashboard</span>
                        </div>
                        <div className="admin-sidebar-icon-wrapper" onClick={() => {showPage('createContestant')}}>
                            <i className="fa-solid fa-user-plus"></i> <span>Add Contestant</span>
                        </div>
                        <div className="admin-sidebar-icon-wrapper" onClick={() => showPage('allContestants')}>
                            <i className="fa-solid fa-users"></i> <span>All Contestants</span>
                        </div> 
                    
                        <div className="admin-sidebar-icon-wrapper text-danger" onClick={() => use_auth.logoutUser()}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> <span>Logout</span>
                        </div>
                    </div>
                    
                </div>

                <div className="admin-dashboard-content">
                    {pages.dashboard_page && <Dashboard />}
                    {pages.createContestant_page && <CreateContestant />}
                    {pages.allContestants_page && <AllContestants />}


                    
                    {/* Add other components as needed */}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


















