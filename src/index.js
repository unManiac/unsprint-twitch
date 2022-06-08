import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import "./index.css";
import SprintOverlay from "./overlays/SprintOverlay";
import ForestOverlay from "./overlays/ForestOverlay";

Sentry.init({
  dsn: "https://22f4233bfca74092907d0c5c44a6732e@o347973.ingest.sentry.io/6410338",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename={process.env.REACT_APP_BASE_URL}>
        <Switch>
          <Route path="/overlay/forest">
            <ForestOverlay />
          </Route>
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
