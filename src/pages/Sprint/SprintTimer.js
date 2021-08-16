import { Button, Grid, lighten, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import {
  PARTICIPANTS_RESET,
  SPRINT_STARTED,
  SPRINT_ENDED,
  SPRINT_CANCELLED,
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
    fontSize: 18,
    "&:hover,&:active,&:focus": {
      backgroundColor: lighten(GREEN, 0.3),
    },
  },
}));

function SprintTimer({ twitch, ...rest }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const sprint = useSelector((state) => state.sprint);
  const config = useSelector((state) => state.configuration);

  /*
  const participants = useSelector((state) => state.participant.list);

  const redeeemParticipant = (participant, tries = 10) => {
    const { username, joined, lives } = participant;

    if (tries === 0 || lives <= 0 || !joined) {
      if (tries === 0) {
        alert("Problema no StreamElements chama unManiac");
      }

      dispatch({
        type: PARTICIPANT_REMOVE,
        username,
      });
      return;
    }

    setTimeout(() => {
      const seconds = Math.abs(joined - sprint.started) / 1000;
      const minutes = Math.ceil(seconds / 60);
      const points = minutes * sprint.multiplier;

      fetch(
        `https://api.streamelements.com/kappa/v2/points/${config.channelId}/${username}/${points}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${config.token}`,
          },
        }
      )
        .then(() => {
          twitch.say(
            config.channel,
            `/me @${username} sobreviveu e ganhou ${points} ${config.loyalty}.`
          );
          dispatch({
            type: PARTICIPANT_REMOVE,
            username,
          });
        })
        .catch(() => {
          redeeemParticipant(participant, --tries);
        });
    }, 1000); // delay 1s to avoid spam chat
  };

  useEffect(() => {
    if (sprint.finished && participants.length) {
      redeeemParticipant(participants[0]);
    }
    // eslint-disable-next-line
  }, [sprint.finished, participants.length]);
  */

  return (
    <Grid container spacing={3} {...rest}>
      <Grid item xs={12} style={{ display: "flex" }}>
        {!sprint.ends && (
          <Button
            variant="contained"
            className={classes.start}
            color="primary"
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
                `${sprint.minutes} minutos`
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
            <Button
              variant="contained"
              style={{ marginRight: 10 }}
              color="secondary"
              onClick={() => {
                dispatch({ type: SPRINT_CANCELLED });
                dispatch({ type: PARTICIPANTS_RESET });
              }}
            >
              Cancelar sprint
            </Button>

            <Countdown
              date={sprint.ends}
              controlled={false}
              onComplete={() => {
                dispatch({ type: SPRINT_ENDED });

                const reply = sprint.messageEnded.replace(
                  "@tempo",
                  `${sprint.minutes} minutos`
                );
                twitch.say(config.channel, `/me ${reply}`);
              }}
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default SprintTimer;
