import { NavLink } from "react-router-dom";
import { useNotification } from "../../../features/Notifications/NotificationsContext";
import { useState } from "react";
import { useAuth } from "../../../features/AuthContext/AuthContext";

export const Navigation = () => {
    const { hasNewNotification } = useNotification();
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <nav className="nav">
            <div className="hamburger" onClick={toggleMenu}>
                {/* add hamburger icon */}
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={`${menuOpen ? "show" : ""}`}>
                {isAuthenticated ?
                    <>
                        {/* <li><NavLink to="/listFeedback" className="nav-button">List Feedback</NavLink></li> */}
                        {/* <li><NavLink to="/profile" className="nav-button">Profile</NavLink></li> */}
                        <li><NavLink to="/models" className="nav-button">Models</NavLink></li>
                        <li><NavLink to="/userDatasets" className="nav-button">Datasets</NavLink></li>
                        <li><NavLink to="/modelcreator" className="nav-button">Designer</NavLink></li>
                        {/* <li><NavLink to="/test"> className="nav-button mx-1">test</NavLink></li> */}
                        <li><NavLink to="/feedback" className="nav-button">Feedback</NavLink></li>
                        {hasNewNotification ?
                            <li><NavLink to="/listNotifications" className="nav-button">New Notifications</NavLink></li> :
                            <li><NavLink to="/listNotifications" className="nav-button">List Notifications</NavLink></li>
                        }
                    </>
                    : undefined}
                <li><NavLink to="/loginPage" className="nav-button">Login</NavLink></li>


            </ul>
        </nav>
    )
}