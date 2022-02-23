import React, { useReducer, createContext, useEffect } from "react";
import { appReducer } from "../reducers/appReducer";
import createPersistedState from "use-persisted-state";
const useCounterState = createPersistedState("userDetail");

export const AppContext = createContext();

const INITIAL_DATA = {
  token: "",
  userData: null,
  userRole: null,
};

const AppContextProvider = (props) => {
  const [intialData, setInitialData] = useCounterState(INITIAL_DATA);
  const [userDetail, dispatch] = useReducer(appReducer, intialData);

  useEffect(() => {
    setInitialData(userDetail);
  }, [userDetail]);

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
