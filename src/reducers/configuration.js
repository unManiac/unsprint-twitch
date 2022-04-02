import { CONFIGURATION_UPDATE } from "../constants/actionTypes";

const sprint = (
  state = {
    oauth: "",
    channel: "",
    token: "",
    channelId: "",
    loyalty: "",
    enableAnnounce: false,
  },
  action
) => {
  switch (action.type) {
    case CONFIGURATION_UPDATE:
      return {
        ...state,
        ...action.configuration,
      };
    default:
      return state;
  }
};

export default sprint;
