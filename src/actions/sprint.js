import {
  PARTICIPANTS_RESET,
  RANKING_RESET,
  SPRINT_CANCELLED,
  SPRINT_ENDED,
  SPRINT_STARTED,
  SPRINT_UPDATE_TIME,
} from "../constants/actionTypes";
import { getLastMonday } from "../helper";
import { addPoints } from "../requests";

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
        twitch.actionSay(
          `@${username} ficou em ${position}° e ganhou ${points}. Seu novo total é ${result.newAmount} ${config.loyalty}.`
        );
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

export function startTime(twitch, minutes) {
  return function (dispatch, getState) {
    const sprint = getState().sprint;
    const config = getState().configuration;
    const rankingLastReset = getState().ranking.lastReset;

    const selectedMinutes = minutes || sprint.minutes;

    window.analytics?.track("Iniciar Sprint", {
      minutos: selectedMinutes,
      userId: config.channel,
    });

    if (sprint.ends) {
      dispatch(changeTime(twitch, selectedMinutes));
      return;
    }

    if (
      sprint.ranking &&
      rankingLastReset &&
      rankingLastReset < getLastMonday()
    ) {
      dispatch(resetRanking(twitch));
    }

    dispatch({
      type: SPRINT_STARTED,
      sprint: {
        started: Date.now(),
        minutes: selectedMinutes,
        ends: Date.now() + selectedMinutes * 60 * 1000,
      },
    });
    dispatch({ type: PARTICIPANTS_RESET });
    const { messageStarted } = sprint;

    if (messageStarted) {
      twitch.actionSay(
        `${messageStarted.replace("@tempo", `${selectedMinutes}`)}`
      );
    }
  };
}

export function changeTime(twitch, minutes) {
  return function (dispatch, getState) {
    const config = getState().configuration;
    
    let selectedMinutes =
      minutes || parseInt(window.prompt("Digite os minutos restante:"));

    if (Number.isNaN(selectedMinutes)) {
      return { message: "Tempo incorreto", severity: "warning" };
    }

    window.analytics?.track("Modificou tempo Sprint", {
      minutos: selectedMinutes,
      userId: config.channel,
    });

    dispatch({
      type: SPRINT_UPDATE_TIME,
      minutes: selectedMinutes,
    });
    twitch.actionSay(
      `unSprint foi atualizado para ${selectedMinutes} minutos, para checar os novos pontos que irá ganhar digite !tempo`
    );
    return { message: "Tempo atualizado", severity: "success" };
  };
}

export function end(twitch) {
  return function (dispatch, getState) {
    dispatch({ type: SPRINT_ENDED });
    const sprint = getState().sprint;
    const config = getState().configuration;
    const participants = getState().participant.list;
    const { messageEnded } = sprint;

    window.analytics?.track("Encerrou Sprint", {
      userId: config.channel,
      participantes: participants.length,
    });

    if (messageEnded) {
      twitch.actionSay(
        `${messageEnded.replace("@tempo", `${sprint.minutes}`)}`
      );
    }
  };
}

export function cancel() {
  return function (dispatch, getState) {
    const config = getState().configuration;

    window.analytics?.track("Cancelou Sprint", {
      userId: config.channel,
    });

    dispatch({ type: SPRINT_CANCELLED });
    dispatch({ type: PARTICIPANTS_RESET });
  };
}
