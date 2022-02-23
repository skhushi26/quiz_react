import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import ListCategory from "../components/categories/ListCategory";
import Login from "../components/Login";
import ListQuestions from "../components/questions/ListQuestions";
import Registration from "../components/Registration";
import { AppContext } from "../contexts/appContext";

const Routing = () => {
  const { userDetail, userRole } = useContext(AppContext);
  const question = [
    {
      question_name: "",
      options: [{ title: "", is_correct: false }],
      category_id: "",
    },
  ];
  console.log(userRole);
  return (
    <Routes>
      <Route exact path="/" element={<Registration />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/list-category" element={<ListCategory />} />
      <Route path="/questions/:categoryId" element={<ListQuestions />} />
    </Routes>
  );
};

export default Routing;
