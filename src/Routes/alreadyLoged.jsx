import { Navigate } from "react-router-dom";

function LogedRoute({ children }) {
    const token = localStorage.getItem("token")
  
    if (token){
        return <Navigate to="/arealojista" replace/>
    }

    return children
}

export default LogedRoute