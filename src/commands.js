import {
  PARTICIPANTS_ADD_LIVES,
  PARTICIPANTS_REMOVE_LIVE,
  PARTICIPANT_ADD,
  PARTICIPANT_REMOVE,
  RANKING_PARTICIPANT_ADD,
} from "./constants/actionTypes";
import { calculatePoints, findBestMultiplier, retryOperation } from "./helper";
import { addPoints } from "./requests";

const commands = {
  "!unsprint": ({ twitchSafeSay }) => {
    twitchSafeSay(
      `unSprint é um jogo onde todos sprintam, enquanto tiver no sprint você pode apenas falar no chat se tiver vidas e ao final os participantes ganharão pontos na lojinha. Para saber os comandos digite !uncomandos`
    );
  },
  "!uncomandos": ({ twitchSafeSay }) => {
    twitchSafeSay(
      `!unsprint / !iniciar / !vida / !tempo / !ganhei / !unranking`
    );
  },
  "!unranking": ({ twitchSafeSay, sprint, ranking }) => {
    if (!sprint.ranking) {
      twitchSafeSay(
        `Ranking desabilitado. Acesse configurações avançadas para ativar.`
      );
      return;
    }

    const top = ranking
      .slice(0, 3)
      .map((p, idx) => `${idx + 1}° ${p.username}`)
      .join(" / ");

    if (!top) {
      twitchSafeSay(`Ninguém entrou no ranking ainda.`);
      return;
    }

    twitchSafeSay(
      `Ranking atual: ${top}. Fique atento, pois os minutos serão zerados toda segunda-feira. Para conferir sua posição digite !minutos`
    );
  },
  "!minutos": ({ twitchSafeSay, sprint, username, ranking }) => {
    if (!sprint.ranking) {
      return;
    }

    const index = ranking.findIndex((p) => p.username === username);

    if (index === -1) {
      twitchSafeSay(`@${username} não está no ranking.`);
      return;
    }

    const participant = ranking[index];

    twitchSafeSay(
      `@${username} possui ${participant.minutes} minutos e sua posição é ${
        index + 1
      }°.`
    );
    return;
  },
  "!iniciar": ({
    twitchSafeSay,
    sprint,
    config,
    participant,
    username,
    dispatch,
    isSubscriber,
    isVip,
  }) => {
    if (participant) {
      twitchSafeSay(`@${username} já está participando.`);
      return;
    }

    if (sprint.finished || !sprint.ends) {
      twitchSafeSay(`@${username} chegou atrasado.`);
      return;
    }

    const joined = Date.now();
    const multiplier = findBestMultiplier(sprint, isSubscriber, isVip);
    const [points, minutes] = calculatePoints(joined, sprint.ends, multiplier);

    dispatch({
      type: PARTICIPANT_ADD,
      participant: {
        username,
        joined,
        lives: parseInt(sprint.lives),
      },
    });

    const reply = sprint.messageConfirmation
      .replace("@nome", `@${username}`)
      .replace("@tempo", `${minutes}`)
      .replace("@resultado", `${points} ${config.loyalty}`);

    twitchSafeSay(reply);
  },
  "!tempo": ({
    sprint,
    config,
    twitchSafeSay,
    participant,
    username,
    isSubscriber,
    isVip,
  }) => {
    if (!participant) {
      twitchSafeSay(`@${username} não está participando.`);
      return;
    }

    const { joined } = participant;

    const multiplier = findBestMultiplier(sprint, isSubscriber, isVip);
    const [points, minutes] = calculatePoints(
      joined,
      sprint.ends || sprint.ended,
      multiplier
    );

    twitchSafeSay(
      `@${username} entrou com ${minutes} minutos e irá ganhar ${points} ${config.loyalty} no final.`
    );
  },
  "!vida": ({
    message,
    sprint,
    twitchSafeSay,
    dispatch,
    participant,
    username,
    isStreamer,
  }) => {
    // only show lives
    if (!isStreamer) {
      if (participant) {
        const { lives } = participant;
        const textLives = `vida${lives > 1 ? "s" : ""}`;

        twitchSafeSay(`@${username} possui ${lives} ${textLives}.`);
      }
      return;
    }

    if (sprint.finished) {
      twitchSafeSay(
        `@${username} só é possível dar vidas enquanto estiver acontecendo o sprint.`
      );
      return;
    }

    // host can add lives to everyone
    const lives = parseInt(message.split(" ")[1]);

    if (Number.isNaN(lives)) {
      twitchSafeSay(`@${username} informe corretamente as vidas.`);
      return;
    } else {
      const reply = sprint.messageBonus.replace("@vida", `${lives} vida(s)`);
      twitchSafeSay(twitchSafeSay, reply);
      dispatch({
        type: PARTICIPANTS_ADD_LIVES,
        lives,
      });
    }
  },
  "!ganhei": ({
    participant,
    twitchSafeSay,
    dispatch,
    config,
    sprint,
    username,
    isSubscriber,
    isVip,
  }) => {
    if (!sprint.finished) {
      twitchSafeSay(`@${username} o tempo ainda não acabou.`);
      return;
    }

    if (!participant) {
      twitchSafeSay(`@${username} não está participando.`);
      return;
    }

    const { joined, lives } = participant;

    if (lives <= 0 || !joined) {
      dispatch({
        type: PARTICIPANT_REMOVE,
        username,
      });
      return;
    }

    const multiplier = findBestMultiplier(sprint, isSubscriber, isVip);
    const [points, minutes] = calculatePoints(joined, sprint.ended, multiplier);

    retryOperation(() => addPoints(username, points, config), 3000, 50).then(
      (result) => {
        twitchSafeSay(
          `@${username} sobreviveu e ganhou ${points}. Seu novo total é ${result.newAmount} ${config.loyalty}.`
        );
        dispatch({
          type: PARTICIPANT_REMOVE,
          username,
        });

        if (sprint.ranking) {
          dispatch({
            type: RANKING_PARTICIPANT_ADD,
            participant: {
              username,
              minutes,
            },
          });
        }
      }
    );
  },
  "!morte": ({
    twitchSafeSay,
    sprint,
    dispatch,
    isMod,
    participant,
    username,
  }) => {
    if (
      sprint.finished ||
      !sprint.ends ||
      !participant ||
      (sprint.modImmune && isMod)
    ) {
      return;
    }

    const { lives } = participant;

    if (lives === 1) {
      dispatch({
        type: PARTICIPANT_REMOVE,
        username,
      });
      twitchSafeSay(
        `@${username} não sobreviveu, digite !iniciar novamente para recomeçar na partida.`
      );
      return;
    }

    dispatch({
      type: PARTICIPANTS_REMOVE_LIVE,
      username,
      lives: 1,
    });

    if (sprint.warnMissingLives) {
      twitchSafeSay(
        `@${username} mandou mensagem no chat e perdeu 1 vida, restam ${
          lives - 1
        } vida(s).`
      );
    }
  },
};

export default commands;
