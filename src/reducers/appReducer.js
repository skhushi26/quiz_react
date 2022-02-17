import { LOGIN_SUCCESS } from "../actions/appActions";

export const appReducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token,
        userData: action.userData,
        userRole: action.userData.role,
      };

    default:
      return state;
  }
};
