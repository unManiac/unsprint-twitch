import React, { useEffect, useMemo } from "react";
import Countdown from "react-countdown";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useTmi from "../useTmi";
import Config from "../pages/Config/Config";
import { end } from "../actions/sprint";
import {
  CONFIGURATION_UPDATE,
  SPRINT_UPDATE,
  VIP_UPDATE,
} from "../constants/actionTypes";
import "./SprintOverlay.css";
import { b64DecodeUnicode } from "../helper";

function SprintOverlay({ end }) {
  const location = useLocation();
  const [twitch, failed] = useTmi({
    enableSprint: true,
    enableForest: false,
  });

  const dispatch = useDispatch();

  const participants = useSelector((state) => state.participant.list);
  const sprint = useSelector((state) => state.sprint);
  const vip = useSelector((state) => state.vip);

  const parameters = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const configParam = useMemo(
    () => (parameters.get("config") || "").replace(new RegExp(" ", "g"), "+"),
    [parameters]
  );

  useEffect(() => {
    if (configParam && localStorage.getItem("hash_unconfig") !== configParam) {
      var configParsed = JSON.parse(b64DecodeUnicode(configParam));
      delete configParsed.sprint.ends;
      delete configParsed.sprint.ended;
      delete configParsed.sprint.minutes;
      delete configParsed.sprint.started;

      if (configParsed.config) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: configParsed.config,
        });
      }
      if (configParsed.sprint) {
        dispatch({
          type: SPRINT_UPDATE,
          sprint: {
            ...sprint,
            ...configParsed.sprint,
          },
        });
      }
      if (vip.list.length === 0 && configParsed.vip) {
        dispatch({
          type: VIP_UPDATE,
          ...(configParsed.vip || {}),
        });
      }
      localStorage.setItem("hash_unconfig", configParam);
    }
  }, [dispatch, sprint, vip, configParam]);

  if (failed) {
    return <Config />;
  }

  const descriptionVariable =
    parameters.get("msg") || ": @minutos minutos (@posicao°)";
  const noRankingVariable = parameters.get("nomsg") || ": sem ranking";

  return (
    <>
      <div style={{ color: "transparent" }}>
        {sprint.ends && (
          <Countdown
            date={sprint.ends}
            controlled={false}
            onComplete={() => end(twitch)}
          />
        )}
      </div>
    </>
  );
}

export default connect(undefined, {
  end,
})(SprintOverlay);
