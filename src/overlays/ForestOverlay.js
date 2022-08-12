import React, { useEffect, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import useTmi from "../useTmi";
import { CONFIGURATION_UPDATE } from "../constants/actionTypes";
import "./SprintOverlay.css";
import { b64DecodeUnicode } from "../helper";
import { end } from "../actions/forest";
import Countdown from "react-countdown";

function ForestOverlay({ location, end }) {
  const [twitch, failed] = useTmi({
    enableSprint: false,
    enableForest: true,
  });

  const dispatch = useDispatch();

  const forest = useSelector((state) => state.forest);
  const config = useSelector((state) => state.configuration);

  const parameters = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const configParam = useMemo(
    () => (parameters.get("config") || "").replace(new RegExp(" ", "g"), "+"),
    [parameters]
  );

  useEffect(() => {
    if (configParam && localStorage.getItem("hash_unforest") !== configParam) {
      const configParsed = JSON.parse(b64DecodeUnicode(configParam));

      if (configParsed.config) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: configParsed.config,
        });
      }
      localStorage.setItem("hash_unforest", configParam);
      window.location.reload();
    }
  }, [dispatch, configParam]);

  if (failed || !config.forestToken) {
    return "Configure novamente";
  }

  const isEn = localStorage.getItem("lang") === "en";

  return (
    <div>
      <div>
        {forest.ends
          ? isEn
            ? "Started"
            : "Iniciado"
          : forest.roomToken || (isEn ? "Ready" : "Pronto")}
      </div>
      <div style={{ visibility: "hidden" }}>
        {forest.ends && (
          <Countdown
            date={forest.ends}
            controlled={false}
            onComplete={() => end(twitch)}
          />
        )}
      </div>
    </div>
  );
}

export default withRouter(
  connect(undefined, {
    end,
  })(ForestOverlay)
);
