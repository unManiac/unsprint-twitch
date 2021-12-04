import { combineReducers } from "redux";
import participant from "./reducers/participant";
import sprint from "./reducers/sprint";
import configuration from "./reducers/configuration";
import ranking from "./reducers/ranking";
import vip from "./reducers/vip";
import goal from "./reducers/goal";

export default combineReducers({
  configuration,
  sprint,
  participant,
  ranking,
  vip,
  goal,
});
