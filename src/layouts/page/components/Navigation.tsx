import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Navigation = () => {

    return (
        <nav className="nav">
            <ul className="d-flex flex-row flex-wrap m-0">
                <li><Link to="/"><Button className="nav-button btn-lg mx-1">Home</Button></Link></li>
                <li><Link to="/login"><Button className="nav-button btn-lg mx-1">Login</Button></Link></li>
                <li><Link to="/logout"><Button className="nav-button btn-lg mx-1">Logout</Button></Link></li>
                <li><Link to="/profile"><Button className="nav-button btn-lg mx-1">Profile</Button></Link></li>
                <li><Link to="/models"><Button className="nav-button btn-lg mx-1">Models</Button></Link></li>
                <li><Link to="/t"><Button className="nav-button btn-lg mx-1">test</Button></Link></li>
            </ul>
        </nav>
    )
}