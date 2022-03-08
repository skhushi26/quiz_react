import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Categories from "../components/categories/Categories";
import ListCategory from "../components/categories/ListCategory";
import Login from "../components/Login";
import ListQuestions from "../components/questions/ListQuestions";
import Questions from "../components/questions/Questions";
import Registration from "../components/Registration";
import { AppContext } from "../contexts/appContext";
import PrivateRoutes from "./PrivateRoutes";

const Routing = () => {
  // const { userDetail, userRole, isAuth } = useContext(AppContext);
  return (
    <Routes>
      <Route exact path="/" element={<Registration />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route exact path="/" element={<PrivateRoutes />}>
        <Route path="/list-category" element={<ListCategory />} />
        <Route path="/questions/:categoryId" element={<ListQuestions />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/question/:id" element={<Questions />} />
      </Route>
    </Routes>
  );
};

export default Routing;
