import { combineReducers } from "redux";
import participant from "./reducers/participant";
import sprint from "./reducers/sprint";
import configuration from "./reducers/configuration";
import ranking from "./reducers/ranking";
import message from "./reducers/message";

export default combineReducers({
  configuration,
  sprint,
  participant,
  ranking,
  message,
});
