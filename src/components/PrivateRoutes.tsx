import { Outlet } from "react-router-dom";
import { useAuth } from "../features/Login/AuthContext"

export const PrivateRoutes = () => {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated){
        return(
            <h2 className="text-center p-2">Log in to see this content</h2>
        )
    }
    return(
        <Outlet />
    )
}