// import { useEffect } from "react";
// import { useAlert } from "../../components/Alerts/AlertContext";
import "./HomePage.css";
import frontImage from "../../assets/front-page.webp"

export const HomePage = () => {
  // const { addAlert } = useAlert();
  //   useEffect(() => {
  //     addAlert("This is an error", "error");
  //     addAlert("Useful information", "info");
  //     addAlert("Process finished", "success");
  //     addAlert("You are warned", "warning");

  //   }, []);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-2">
      <h2 className="main-desc m-2">Welcome to <b>KeraSage</b> designer hub</h2>
      <img className="m-2 overflow-auto home-page-image bordered-image" src={frontImage}></img>
    </div>
  );
}