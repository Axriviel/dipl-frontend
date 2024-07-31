import { useState } from "react";
import { Login } from "./components/Login";
import "./LoginPage.css"
import { Register } from "./components/Register";
import { useAuth } from "../../features/Login/AuthContext";
import Logout from "./components/Logout";

export const LoginPage = () => {
    const [isRegistration, setRegistration] = useState<boolean>(false)
    const { isAuthenticated } = useAuth();

    const handleSwitch = () => {
        setRegistration(!isRegistration)
    }

    return (
        <div className="d-flex justify-content-center m-2">
            {!isRegistration ?
                !isAuthenticated ?
                    <div>
                        <Login />
                        <span className="link-text d-flex justify-content-center" onClick={handleSwitch}> No account yet? </span>
                    </div> :
                    <div>
                        Already logged in. 
                        <Logout />
                    </div>

                :
                <div>
                    <Register />
                    <span className="link-text m-2 d-flex justify-content-center" onClick={handleSwitch}> Back </span>
                </div>
            }
        </div>
    );
};