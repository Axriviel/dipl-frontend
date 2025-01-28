import '../styles/Header.css';
import logoImage from "../../../assets/logo.svg"
import { Navigation } from './Navigation';
import { Link } from 'react-router-dom';

export const Header = () => {

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <img className="bordered-image" src={logoImage}></img>
                </Link></div>
            <Navigation />
        </header>
    );
};