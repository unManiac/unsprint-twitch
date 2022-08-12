import React, { useEffect, useMemo } from "react";
import Countdown from "react-countdown";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import useTmi from "../useTmi";
import Config from "../pages/Config/Config";
import { end } from "../actions/sprint";
import $ from "jquery";
import {
  CONFIGURATION_UPDATE,
  SPRINT_UPDATE,
  VIP_UPDATE,
} from "../constants/actionTypes";
import "./SprintOverlay.css";
import { b64DecodeUnicode } from "../helper";
import BatchListener from "../components/BatchListener";

let currentId = 0;
let timeoutId = 0;
function scrollAnimate(id, top, scroll) {
  clearTimeout(timeoutId);
  if (id !== currentId) return;
  try {
    const element = $("#animate");
    element.stop(true);

    if (!element[0]) {
      return;
    }

    const scrollTop = top
      ? 0
      : element[0].scrollHeight - element[0].offsetHeight;
    timeoutId = setTimeout(
      () =>
        element.animate(
          { scrollTop },
          element[0].scrollHeight * scroll,
          "linear",
          () => scrollAnimate(id, !top, scroll)
        ),
      1000
    );
  } catch (err) {}
}

function SprintOverlay({ end, location }) {
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
  const scrollParam = useMemo(() => {
    let scroll = Number.parseInt(parameters.get("scroll"));
    if (Number.isNaN(scroll)) {
      scroll = 20;
    }
    return scroll;
  }, [parameters]);

  useEffect(() => {
    window.document.getElementsByTagName("html")[0].classList.add("overlay");
    return () =>
      window.document
        .getElementsByTagName("html")[0]
        .classList.remove("overlay");
  }, []);

  useEffect(() => {
    currentId++;
    scrollAnimate(currentId, false, scrollParam);
    return () => clearTimeout(timeoutId);
  }, [participants, scrollParam]);

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
      <BatchListener />
      <div id="animate">
        {participants.map((p) => {
          let description = p.ranking
            ? descriptionVariable
                .replace("@minutos", p.ranking.minutes)
                .replace("@posicao", p.ranking.position)
            : noRankingVariable;
          return (
            <div key={p.username} className="participant">
              {p.username}
              {description}
            </div>
          );
        })}
      </div>
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

export default withRouter(
  connect(undefined, {
    end,
  })(SprintOverlay)
);
