import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { store } from "./store";
import "./index.css";
import SprintOverlay from "./overlays/SprintOverlay";
import ForestOverlay from "./overlays/ForestOverlay";
import TimerOverlay from "./overlays/TimerOverlay";
import OAuthTwitch from "./components/OAuthTwitch";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename={import.meta.env.VITE_BASE_URL}>
        <Routes>
          <Route path="/overlay/timer" element={<TimerOverlay />} />
          <Route path="/overlay/forest" element={<ForestOverlay />} />
          <Route path="/overlay/sprint" element={<SprintOverlay />} />
          <Route path="/oauth/twitch" element={<OAuthTwitch />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
