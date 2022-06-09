import { CONFIGURATION_UPDATE } from "../constants/actionTypes";

const configuration = (
  state = {
    oauth: "",
    channel: "",
    token: "",
    channelId: "",
    loyalty: "",
    enableAnnounce: false,
    enableAnnounceForest: false,
    forestEmail: "",
    forestPassword: "",
    forestToken: "",
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

export default configuration;
