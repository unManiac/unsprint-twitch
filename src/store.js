import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { save, load } from "redux-localstorage-simple";
import reducer from "./reducer";

const getNamespace = () => {
  if (document.location.href.includes("overlay/forest")) {
    return "simple_local_forest";
  } else if (document.location.href.includes("overlay/timer")) {
    return "simple_local_timer";
  }
  return undefined;
};

const getMiddleware = () => {
  return applyMiddleware(
    thunk,
    save({ namespace: getNamespace() }),
    createLogger()
  );
};

export const store = createStore(
  reducer,
  load({ namespace: getNamespace() }),
  composeWithDevTools(getMiddleware())
);
