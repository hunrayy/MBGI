import { useState, useEffect } from "react";
import './home.css'
import FirstLandingPage from "../../components/firstLandingPage/FirstLandingPage";
import ContestantsListings from "../../components/contestantsListings/ContestantsListings";
import Footer from "../../components/footer/Footer"
import Navbar from "../../components/navbar/Navbar"
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { user, loading } = useAuth();
    if (loading) {
      return null; // or a simple splash screen
    }
  return (
   <header>
    <Navbar />
    <FirstLandingPage />
    <ContestantsListings />
    <Footer />
   </header>
  );
}

