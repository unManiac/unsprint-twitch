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

  const parameters = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const configParam = useMemo(
    () => (parameters.get("config") || "").replace(new RegExp(" ", "g"), "+"),
    [parameters]
  );

  useEffect(() => {
    if (configParam && localStorage.getItem("unconfig") !== configParam) {
      const configParsed = JSON.parse(b64DecodeUnicode(configParam));

      if (configParsed.config) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: configParsed.config,
        });
      }
      localStorage.setItem("unconfig", configParam);
      window.location.reload();
    }
  }, [dispatch, configParam]);

  if (failed) {
    return "Configure novamente";
  }

  return (
    <div>
      <div>{forest.roomToken || "Aguardando"}</div>
    </div>
  );
}

export default withRouter(ForestOverlay);
