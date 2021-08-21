import { Button, Grid, lighten, makeStyles, Tooltip } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import {
  PARTICIPANTS_RESET,
  SPRINT_STARTED,
  SPRINT_ENDED,
  SPRINT_CANCELLED,
  SPRINT_UPDATE,
} from "../../constants/actionTypes";
import { GREEN, WHITE } from "../../constants/colors";

const useStyles = makeStyles((theme) => ({
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

function SprintTimer({ twitch, updateAlert, ...rest }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const sprint = useSelector((state) => state.sprint);
  const config = useSelector((state) => state.configuration);

  const changeTime = () => {
    let minutos = parseInt(window.prompt("Digite os minutos restante:"));

    if (Number.isNaN(minutos)) {
      updateAlert({ message: "Tempo incorreto", severity: "warning" });
      return;
    }

    dispatch({
      type: SPRINT_UPDATE,
      sprint: {
        ends: Date.now() + minutos * 60 * 1000,
      },
    });
    updateAlert({ message: "Tempo atualizado", severity: "success" });
    twitch.say(
      config.channel,
      `/me unSprint foi atualizado para ${minutos} minutos, para checar os novos pontos que irá ganhar digite !tempo`
    );
  };

  const end = () => {
    dispatch({ type: SPRINT_ENDED });

    const reply = sprint.messageEnded.replace("@tempo", `${sprint.minutes}`);
    twitch.say(config.channel, `/me ${reply}`);
  };

  return (
    <Grid container spacing={3} {...rest}>
      <Grid item xs={12} style={{ display: "flex" }}>
        {!sprint.ends && (
          <Button
            variant="contained"
            className={classes.start}
            color="primary"
            size="large"
            onClick={() => {
              dispatch({
                type: SPRINT_STARTED,
                sprint: {
                  started: Date.now(),
                  ends: Date.now() + sprint.minutes * 60 * 1000,
                },
              });
              dispatch({ type: PARTICIPANTS_RESET });

              const reply = sprint.messageStarted.replace(
                "@tempo",
                `${sprint.minutes}`
              );
              twitch.say(config.channel, `/me ${reply}`);
            }}
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
                onClick={changeTime}
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
                  window.confirm("Deseja realmente encerrar?") && end()
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
                  dispatch({ type: SPRINT_CANCELLED });
                  dispatch({ type: PARTICIPANTS_RESET });
                }
              }}
            >
              Cancelar sprint
            </Button>

            <Countdown date={sprint.ends} controlled={false} onComplete={end} />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default SprintTimer;
