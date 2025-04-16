import "./HomePage.css";
import frontImage from "../../assets/front-page.webp"

export const HomePage = () => {

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-2">
      <h2 className="main-desc m-2">Welcome to <b>KeraSage</b> designer hub</h2>
      <img className="m-2 overflow-auto home-page-image bordered-image" src={frontImage}></img>
    </div>
  );
}