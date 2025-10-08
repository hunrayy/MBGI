

import { useNavigate } from "react-router-dom"
import logo from "../../../public/MBGI_logo.png"

const Logo = () => {
    const navigate = useNavigate()
    return <div style={{cursor: "pointer"}} onClick={()=> navigate('/')}>
        <img src={logo} alt="Logo" width="70px" />

    </div>
}
export default Logo