import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Navigation = () => {

    return (
        <nav className="nav">
            <ul className="d-flex flex-row flex-wrap m-0">
                <li><Link to="/loginPage"><Button className="nav-button btn-lg mx-1">Login</Button></Link></li>
                <li><Link to="/profile"><Button className="nav-button btn-lg mx-1">Profile</Button></Link></li>
                <li><Link to="/models"><Button className="nav-button btn-lg mx-1">Models</Button></Link></li>
                <li><Link to="/modelcreator"><Button className="nav-button btn-lg mx-1">Designer</Button></Link></li>
                <li><Link to="/test"><Button className="nav-button btn-lg mx-1">test</Button></Link></li>
                <li><Link to="/feedback"><Button className="nav-button btn-lg mx-1">Feedback</Button></Link></li>
                <li><Link to="/listFeedback"><Button className="nav-button btn-lg mx-1">List Feedback</Button></Link></li>
                <li><Link to="/listNotifications"><Button className="nav-button btn-lg mx-1">List Notifications</Button></Link></li>
            </ul>
        </nav>
    )
}