import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import useTmi from "../useTmi";
import { CONFIGURATION_UPDATE } from "../constants/actionTypes";
import "./SprintOverlay.css";
import { b64DecodeUnicode } from "../helper";

function ForestOverlay({ location }) {
  const [, failed] = useTmi({
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
    if (configParam && localStorage.getItem("unforest") !== configParam) {
      const configParsed = JSON.parse(b64DecodeUnicode(configParam));

      if (configParsed.config) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: configParsed.config,
        });
      }
      localStorage.setItem("unforest", configParam);
      window.location.reload();
    }
  }, [dispatch, configParam]);

  if (failed || !config.forestToken) {
    return "Configure novamente";
  }

  const isEn = localStorage.getItem("lang") === "en";

  return (
    <div>
      <div>{forest.roomToken || (isEn ? "Ready" : "Pronto")}</div>
    </div>
  );
}

export default withRouter(ForestOverlay);
