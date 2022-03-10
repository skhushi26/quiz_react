import React, { useContext, useEffect } from "react";
import { showConfirmation } from "./AlertService";
import { Button } from "react-bootstrap";
import { AppContext } from "../contexts/appContext";
import "../styles/login.scss";

const Logout = () => {
  const { dispatch, isAuth } = useContext(AppContext);
  const handleLogout = async () => {
    if (await showConfirmation("Are you sure you want to logout")) {
      dispatch({
        type: "LOGOUT",
      });
    }
  };

  if (!isAuth) return <></>;

  return (
    <Button variant="link" className="logout-text" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
