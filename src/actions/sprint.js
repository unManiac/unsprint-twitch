import { v4 as uuidv4 } from "uuid";
import {
  PARTICIPANTS_RESET,
  RANKING_RESET,
  SPRINT_CANCELLED,
  SPRINT_ENDED,
  SPRINT_STARTED,
  SPRINT_UPDATE_TIME,
} from "../constants/actionTypes";
import { getLastMonday } from "../helper";
import { addPoints, saveSprint } from "../requests";
import { segmentIdentify, segmentTrack } from "../utils/segment";
import { toast } from "sonner";

function addPointsByRanking(twitch, position) {
  return function (dispatch, getState) {
    const sprint = getState().sprint;
    const ranking = getState().ranking.list;
    const config = getState().configuration;

    const multiplier = parseFloat(sprint[`rankingPrize${position}`]);
    const participant = ranking[position - 1];

    if (!participant || !multiplier) {
      return;
    }

    const { username, minutes } = participant;

    const points = parseInt(minutes * multiplier);
    return addPoints(username, points, config)
      .then((result) => {
        if (result.newAmount) {
          twitch.actionSay(
            `@${username} ficou em ${position}° e ganhou ${points}. Seu novo total é ${result.newAmount} ${config.loyalty}.`
          );
        } else {
          twitch.actionSay(`!addpoints ${username} ${points}`);
        }
      })
      .catch(() => {
        twitch.actionSay(
          `Não foi possível adicionar ${points} para @${username}`
        );
      });
  };
}

function resetRanking(twitch) {
  return async function (dispatch, getState) {
    await Promise.all([
      dispatch(addPointsByRanking(twitch, 1)),
      dispatch(addPointsByRanking(twitch, 2)),
      dispatch(addPointsByRanking(twitch, 3)),
    ]);

    dispatch({
      type: RANKING_RESET,
    });
  };
}

export function startTime(twitch, minutes, silence) {
  return function (dispatch, getState) {
    const sprint = getState().sprint;
    const config = getState().configuration;
    const rankingLastReset = getState().ranking.lastReset;

    const selectedMinutes = minutes || sprint.minutes;

    if (sprint.ends) {
      dispatch(changeTime(twitch, selectedMinutes, silence));
      return;
    }

    if (
      !silence &&
      !sprint.disableResetRanking &&
      sprint.ranking &&
      rankingLastReset &&
      rankingLastReset < getLastMonday()
    ) {
      dispatch(resetRanking(twitch));
    }

    const newSprint = {
      started: Date.now(),
      uuid: uuidv4(),
      minutes: selectedMinutes,
      ends: Date.now() + selectedMinutes * 60 * 1000,
    };

    dispatch({
      type: SPRINT_STARTED,
      sprint: newSprint,
    });
    dispatch({ type: PARTICIPANTS_RESET });

    if (silence) {
      return;
    }

    saveSprint(config.oauth, config.channel, [
      {
        username: config.channel,
        sprint: newSprint.uuid,
        minutos: newSprint.minutes,
        evento: "criar",
      },
    ]);

    const { messageStarted } = sprint;

    if (messageStarted) {
      twitch.actionSay(
        `${messageStarted.replace("@tempo", `${selectedMinutes}`)}`
      );
    }

    segmentIdentify(config.channel);
    segmentTrack("Iniciar Sprint", {
      minutos: newSprint.minutes,
      sprint: newSprint.uuid,
      userId: config.channel,
    });
  };
}

export function changeTime(twitch, minutes, silence) {
  return function (dispatch, getState) {
    const config = getState().configuration;
    const sprint = getState().sprint;

    let selectedMinutes =
      minutes || parseInt(window.prompt("Digite os minutos restante:"));

    if (Number.isNaN(selectedMinutes)) {
      toast.warn("Tempo incorreto.");
      return;
    }

    dispatch({
      type: SPRINT_UPDATE_TIME,
      minutes: selectedMinutes,
    });

    if (silence) {
      return;
    }

    saveSprint(config.oauth, config.channel, [
      {
        username: config.channel,
        sprint: sprint.uuid,
        minutos: selectedMinutes,
        evento: "atualizar",
      },
    ]);

    segmentTrack("Modificou tempo Sprint", {
      minutos: selectedMinutes,
      userId: config.channel,
      sprint: sprint.uuid,
    });

    twitch.actionSay(
      `unSprint foi atualizado para ${selectedMinutes} minutos, para checar os novos pontos que irá ganhar digite !tempo`
    );
    toast.success("Tempo atualizado.");
  };
}

export function end(twitch, silence) {
  return function (dispatch, getState) {
    dispatch({ type: SPRINT_ENDED });
    const sprint = getState().sprint;
    const config = getState().configuration;
    const { messageEnded } = sprint;

    if (silence) {
      return;
    }

    saveSprint(config.oauth, config.channel, [
      {
        username: config.channel,
        sprint: sprint.uuid,
        minutos: sprint.minutes,
        evento: "encerrar",
      },
    ]);

    segmentTrack("Encerrou Sprint", {
      userId: config.channel,
      sprint: sprint.uuid,
    });

    if (messageEnded) {
      twitch.actionSay(
        `${messageEnded.replace("@tempo", `${sprint.minutes}`)}`
      );
    }
  };
}

export function cancel(silence) {
  return function (dispatch, getState) {
    const config = getState().configuration;
    const sprint = getState().sprint;

    dispatch({ type: SPRINT_CANCELLED });
    dispatch({ type: PARTICIPANTS_RESET });

    if (silence) {
      return;
    }

    saveSprint(config.oauth, config.channel, [
      {
        username: config.channel,
        sprint: sprint.uuid,
        minutos: sprint.minutes,
        evento: "cancelar",
      },
    ]);
  };
}
