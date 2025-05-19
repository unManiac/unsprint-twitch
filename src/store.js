import { applyMiddleware, createStore, compose } from "redux";
import { createLogger } from "redux-logger";
import { thunk } from "redux-thunk";
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

// Set up Redux DevTools if it's available in window
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(
  reducer,
  load({ namespace: getNamespace() }),
  composeEnhancers(getMiddleware())
);
