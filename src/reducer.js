import { combineReducers } from "redux";
import participant from "./reducers/participant";
import sprint from "./reducers/sprint";
import configuration from "./reducers/configuration";

export default combineReducers({
  configuration,
  sprint,
  participant,
});
