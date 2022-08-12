import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { save, load } from "redux-localstorage-simple";
import reducer from "./reducer";

const getMiddleware = () => {
  let namespace = undefined;
  if (document.location.href.includes("overlay/forest")) {
    namespace = "simple_local_forest";
  } else if (document.location.href.includes("overlay/sprint")) {
    namespace = "simple_local_sprint";
  }
  return applyMiddleware(thunk, save({ namespace }), createLogger());
};

export const store = createStore(
  reducer,
  load(),
  composeWithDevTools(getMiddleware())
);
