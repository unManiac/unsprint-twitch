import { useMemo, createRef } from "react";
import { connect, useSelector } from "react-redux";
import useTmi from "../useTmi";
import "./SprintOverlay.css";
import { end } from "../actions/sprint";
import Countdown from "react-countdown";
import encerrouMp3 from "./assets/encerrou.mp3";

function TimerOverlay({ location, end }) {
  const sprint = useSelector((state) => state.sprint);
  const audioEncerrouRef = createRef();

  const parameters = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const channel = useMemo(() => parameters.get("channel") || "", [parameters]);
  const font = useMemo(() => parameters.get("font") || "", [parameters]);
  const [twitch] = useTmi({
    enableSprint: false,
    enableForest: false,
    enableTimer: true,
    channel,
  });

  return (
    <div style={{ fontFamily: font }}>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
      ></link>
      <link
        href={`https://fonts.googleapis.com/css2?family=${font}:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700`}
        rel="stylesheet"
      ></link>
      {sprint.ends ? (
        <Countdown
          zeroPadDays={null}
          date={sprint.ends}
          controlled={false}
          onComplete={() => {
            end(twitch, true);
            try {
              audioEncerrouRef.current.currentTime = 0;
              audioEncerrouRef.current.volume = 0.2;
              audioEncerrouRef.current.play();
            } catch (err) {}
          }}
          renderer={({ hours, minutes, seconds, completed }) => {
            if (completed) {
              return "00:00:00";
            } else {
              return (
                <span>
                  {String(hours).padStart(2, "0")}:
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              );
            }
          }}
        />
      ) : (
        "00:00:00"
      )}

      <audio ref={audioEncerrouRef} style={{ display: "none" }}>
        <source src={encerrouMp3} />
      </audio>
    </div>
  );
}

export default connect(undefined, {
  end,
})(TimerOverlay);
