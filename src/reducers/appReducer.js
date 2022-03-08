import { LOGIN_SUCCESS } from "../actions/appActions";

export const appReducer = (state, action) => {
  console.log("state, action", state, action);
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token,
        userData: action.userData,
        userRole: action.userRole,
        isAuth: true,
      };

    default:
      return state;
  }
};
