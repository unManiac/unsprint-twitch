import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import "./index.css";
import SprintOverlay from "./overlays/SprintOverlay";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename={process.env.REACT_APP_BASE_URL}>
        <Switch>
          <Route path="/overlay/sprint">
            <SprintOverlay />
          </Route>
          <Route>
            <App />
          </Route>
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
