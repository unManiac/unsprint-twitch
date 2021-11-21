import { Button, Grid, lighten, makeStyles, Tooltip } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import Countdown from "react-countdown";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  PARTICIPANTS_RESET,
  SPRINT_CANCELLED,
} from "../../constants/actionTypes";
import { GREEN, WHITE } from "../../constants/colors";
import { startTime, changeTime, end, cancel } from "../../actions/sprint";

const useStyles = makeStyles(() => ({
  root: {},
  step: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "0",
  },
  start: {
    backgroundColor: GREEN,
    color: WHITE,
    "&:hover,&:active,&:focus": {
      backgroundColor: lighten(GREEN, 0.3),
    },
  },
}));

function SprintTimer({
  twitch,
  updateAlert,
  startTime,
  changeTime,
  end,
  cancel,
  ...rest
}) {
  const classes = useStyles();
  const sprint = useSelector((state) => state.sprint);

  return (
    <Grid container spacing={3} {...rest}>
      <Grid item xs={12} style={{ display: "flex" }}>
        {!sprint.ends && (
          <Button
            variant="contained"
            className={classes.start}
            color="primary"
            size="large"
            onClick={() => startTime(twitch)}
          >
            Iniciar Sprint de {sprint.minutes} minutos
          </Button>
        )}

        {sprint.finished && (
          <Alert style={{ flex: 1, marginLeft: 10 }} severity="info">
            Sprint finalizado!
          </Alert>
        )}

        {sprint.ends && (
          <div>
            <Tooltip title="Após modificar o tempo, os participantes terão seus pontos recalculados com base no novo tempo.">
              <Button
                variant="outlined"
                style={{ marginRight: 10 }}
                color="primary"
                onClick={() => updateAlert(changeTime(twitch))}
              >
                Modificar tempo
              </Button>
            </Tooltip>

            <Tooltip title="Os participantes vão pode resgatar seus pontos e de acordo com o tempo prometido de sprint.">
              <Button
                variant="outlined"
                style={{ marginRight: 10 }}
                color="default"
                onClick={() =>
                  window.confirm("Deseja realmente encerrar?") && end(twitch)
                }
              >
                Encerrar antes
              </Button>
            </Tooltip>

            <Button
              variant="outlined"
              style={{ marginRight: 10 }}
              color="secondary"
              onClick={() => {
                if (window.confirm("Deseja realmente cancelar?")) {
                  cancel();
                }
              }}
            >
              Cancelar sprint
            </Button>

            <Countdown
              date={sprint.ends}
              controlled={false}
              onComplete={() => end(twitch)}
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default connect(undefined, {
  startTime,
  changeTime,
  end,
  cancel,
})(SprintTimer);
