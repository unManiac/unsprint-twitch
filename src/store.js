import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { save, load } from "redux-localstorage-simple";
import reducer from "./reducer";

const getMiddleware = () => {
  return applyMiddleware(save(), createLogger());
};

export const store = createStore(
  reducer,
  load(),
  composeWithDevTools(getMiddleware())
);
