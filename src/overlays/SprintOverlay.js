import React, { useEffect, useMemo } from "react";
import Countdown from "react-countdown";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import useTmi from "../useTmi";
import Config from "../pages/Config/Config";
import { end } from "../actions/sprint";
import $ from "jquery";
import { CONFIGURATION_UPDATE, SPRINT_UPDATE } from "../constants/actionTypes";

let currentId = 0;
function scrollAnimate(id, top, duration = 1000) {
  if (id !== currentId) return;
  const html = $("html");
  const scrollTop = top ? 0 : window.document.body.offsetHeight - 40;
  setTimeout(
    () =>
      html.animate({ scrollTop }, duration, "linear", () =>
        scrollAnimate(id, !top, duration)
      ),
    100
  );
}

function SprintOverlay({ end, location }) {
  const [twitch, failed] = useTmi();

  const dispatch = useDispatch();

  const participants = useSelector((state) => state.participant.list);
  const sprint = useSelector((state) => state.sprint);

  const parameters = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const configParam = useMemo(() => parameters.get("config"), [parameters]);

  useEffect(() => {
    currentId++;
    const timeoutId = setTimeout(
      () => scrollAnimate(currentId, true, participants.length * 1000),
      500
    );
    return () => clearTimeout(timeoutId);
  }, [participants]);

  useEffect(() => {
    if (configParam && localStorage.getItem("unconfig") !== configParam) {
      var configParsed = JSON.parse(window.atob(configParam));
      dispatch({
        type: CONFIGURATION_UPDATE,
        configuration: configParsed.config,
      });
      dispatch({
        type: SPRINT_UPDATE,
        sprint: configParsed.sprint,
      });
      localStorage.setItem("unconfig", configParam);
    }
  }, [dispatch, configParam]);

  if (failed) {
    return <Config />;
  }

  let participantStyle = {};
  try {
    if (parameters.get("p")) participantStyle = JSON.parse(parameters.get("p"));
  } catch (err) {
    console.log(err);
  }

  const descriptionVariable =
    parameters.get("msg") || ": @minutos minutos (@posicao°)";
  const noRankingVariable = parameters.get("nomsg") || ": sem ranking";

  return (
    <div style={{ overflow: "auto" }} id="animate">
      {participants.map((p) => {
        let description = p.ranking
          ? descriptionVariable
              .replace("@minutos", p.ranking.minutes)
              .replace("@posicao", p.ranking.position)
          : noRankingVariable;
        return (
          <div key={p.username} style={participantStyle}>
            {p.username}
            {description}
          </div>
        );
      })}
      <div style={{ color: "transparent" }}>
        {sprint.ends && (
          <Countdown
            date={sprint.ends}
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
  })(SprintOverlay)
);
