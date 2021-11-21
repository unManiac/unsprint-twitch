import { makeStyles } from "@material-ui/core";
import React from "react";
import Countdown from "react-countdown";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { GREEN } from "../constants/colors";
import useTmi from "../useTmi";
import Config from "../pages/Config/Config";
import { end } from "../actions/sprint";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
  },
  timer: {
    marginBottom: 30,
  },
  total: {
    textAlign: "center",
    fontWeight: 500,
    color: GREEN,
    marginTop: 0,
    marginBottom: 5,
  },
}));

function SprintOverlay({ end }) {
  const classes = useStyles();
  const [twitch, failed] = useTmi();

  const dispatch = useDispatch();

  const participants = useSelector((state) => state.participant.list);
  const sprint = useSelector((state) => state.sprint);
  const ranking = useSelector((state) => state.ranking.list);
  const config = useSelector((state) => state.configuration);

  if (failed) {
    return <Config />;
  }

  return (
    <div>
      {participants.map((p) => (
        <div>{p.username}</div>
      ))}
    </div>
  );
}

export default withRouter(
  connect(undefined, {
    end,
  })(SprintOverlay)
);
