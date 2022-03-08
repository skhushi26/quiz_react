import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../contexts/appContext";

export default function PrivateRoutes() {
  const { isAuth } = useContext(AppContext);
  // determine if authorized, from context or however you're doing it

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}
