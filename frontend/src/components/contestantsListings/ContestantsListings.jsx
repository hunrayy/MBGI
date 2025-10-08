
import './contestantsListings.css'
import { useNavigate } from 'react-router-dom';
import Contestants from '../contestants/Contestants';
const ContestantsListings = () => {
  const navigate = useNavigate()

  return (
    <div className="contestants-listings-container">
      <h1 className="display-5 fw-bold text-center">MEET THE CONTESTANTS</h1>
      <p className="mb-4" style={{fontSize: "20px", textAlign: "center", fontWeight: "600", color: "#aaa"}}>
        Vote for your favorite and help them win the crown
      </p>
      <Contestants />  
    </div>
  );
}

export default ContestantsListings;
