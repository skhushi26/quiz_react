import React, { useReducer, createContext, useEffect } from "react";
import { appReducer } from "../reducers/appReducer";

export const AppContext = createContext();

const INITIAL_DATA = {
  token: "",
  userData: null,
  userRole: null,
};

const AppContextProvider = (props) => {
  const [userDetail, dispatch] = useReducer(appReducer, INITIAL_DATA);
  console.log("userDetail", userDetail);

  return (
    <AppContext.Provider
      value={{
        userDetail,
        token: userDetail.authToken,
        userRole: userDetail.role,
        dispatch,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
