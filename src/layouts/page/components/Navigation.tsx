import { NavLink } from "react-router-dom";
import { useNotification } from "../../../features/Notifications/NotificationsContext";
import { useState } from "react";

export const Navigation = () => {
    const { hasNewNotification } = useNotification();
    const [menuOpen, setMenuOpen] = useState(false);

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
                <li><NavLink to="/loginPage" className="nav-button">Login</NavLink></li>
                <li><NavLink to="/profile" className="nav-button">Profile</NavLink></li>
                <li><NavLink to="/models" className="nav-button">Models</NavLink></li>
                <li><NavLink to="/modelcreator" className="nav-button">Designer</NavLink></li>
                {/* <li><NavLink to="/test"> className="nav-button mx-1">test</NavLink></li> */}
                <li><NavLink to="/feedback" className="nav-button">Feedback</NavLink></li>
                <li><NavLink to="/listFeedback" className="nav-button">List Feedback</NavLink></li>
                {hasNewNotification ?
                    <li><NavLink to="/listNotifications" className="nav-button">New Notifications</NavLink></li> :
                    <li><NavLink to="/listNotifications" className="nav-button">List Notifications</NavLink></li>
                }
            </ul>
        </nav>
    )
}