import {
  VIP_ADD_PERSON,
  VIP_REMOVE_PERSON,
  VIP_UPDATE,
} from "../constants/actionTypes";

// vip != twitch vip
const vip = (state = { multiplier: 5, list: [] }, action) => {
  switch (action.type) {
    case VIP_UPDATE:
      return {
        ...state,
        ...action,
      };
    case VIP_ADD_PERSON:
      return {
        ...state,
        list: [...state.list, action.username],
      };
    case VIP_REMOVE_PERSON:
      return {
        ...state,
        list: state.list.filter((username) => username !== action.username),
      };
    default:
      return state;
  }
};

export default vip;
