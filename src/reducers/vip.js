import { VIP_UPDATE } from "../constants/actionTypes";

// vip != twitch vip
const vip = (state = { multiplier: 5, list: [] }, action) => {
  switch (action.type) {
    case VIP_UPDATE:
      return {
        ...state,
        ...action,
      };
    default:
      return state;
  }
};

export default vip;
