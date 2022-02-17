import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Registration from "../components/Registration";

const Routing = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Registration />} />
      <Route exact path="/signup" element={<Registration />} />
      <Route exact path="/login" element={<Login />} />
    </Routes>
  );
};

export default Routing;
