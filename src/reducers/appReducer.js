import { LOGIN_SUCCESS, LOGOUT, LOADER } from "../actions/appActions";

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

    case LOGOUT:
      return {
        ...state,
        token: null,
        userData: null,
        userRole: null,
        isAuth: false,
      };

    case LOADER:
      return { ...state, loader: action.loader };

    default:
      return state;
  }
};
