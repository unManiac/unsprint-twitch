import { v4 as uuidv4 } from "uuid";
import {
  PARTICIPANTS_ADD_LIVES,
  PARTICIPANTS_REMOVE_LIVE,
  PARTICIPANT_ADD,
  PARTICIPANT_REMOVE,
  RANKING_PARTICIPANT_ADD,
} from "./constants/actionTypes";
import { calculatePoints, findBestMultiplier } from "./helper";
import { addPoints } from "./requests";
import moment from "moment-timezone";
import "moment/locale/pt-br";

export const dict = {
  iniciar:
    /inica|inicar|inciar|inica|teamobot|melhorbot|botdesprintmelhorquealgunsoutrosquexistemai|estudar|trabalhar|shade|foco|foquei|focada|focado|sprintei|mamei/,
  minutos: /minuts|mins|resgate|resgatado/,
};

const iniciar = ({
  twitchActionSay,
  sprint,
  config,
  special,
  ranking,
  participant,
  username,
  userId,
  dispatch,
  isSubscriber,
  isVip,
}) => {
  if (participant) {
    twitchActionSay(
      sprint.messageAlreadyConfirmed.replace("@nome", `@${username}`)
    );
    return;
  }

  if (sprint.finished || !sprint.ends) {
    twitchActionSay(sprint.messageLate.replace("@nome", `@${username}`));
    return;
  }

  const joined = Date.now();
  const multiplier = findBestMultiplier(
    username,
    sprint,
    isSubscriber,
    isVip,
    special
  );
  const [points, minutes] = calculatePoints(joined, sprint.ends, multiplier);

  const index = ranking.findIndex((p) => p.username === username);
  const participantRank =
    index === -1 ? undefined : { ...ranking[index], position: index + 1 };

  const newParticipant = {
    uuid: uuidv4(),
    userId,
    username,
    joined,
    ranking: participantRank,
    lives: parseInt(sprint.lives),
  };

  dispatch({
    type: PARTICIPANT_ADD,
    participant: newParticipant,
  });

  const reply = sprint.messageConfirmation
    .replace("@nome", `@${username}`)
    .replace("@tempo", `${minutes}`)
    .replace("@resultado", `${points} ${config.loyalty}`);

  twitchActionSay(reply);
};

const ganhei = ({
  participant,
  twitchActionSay,
  dispatch,
  config,
  special,
  sprint,
  username,
  userId,
  isSubscriber,
  isVip,
  silent,
}) => {
  if (!sprint.finished) {
    if (!silent)
      twitchActionSay(sprint.messageAnxious.replace("@nome", `@${username}`));
    return;
  }

  if (!participant) {
    if (!silent)
      twitchActionSay(sprint.messageLate.replace("@nome", `@${username}`));
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

  const multiplier = findBestMultiplier(
    username,
    sprint,
    isSubscriber,
    isVip,
    special
  );
  const [points, minutes] = calculatePoints(joined, sprint.ended, multiplier);

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

  const loop = async (tries) => {
    addPoints(username, points, config)
      .then((result) => {
        // Token expirado no StreamElements, envia mensagem no chat diretamente
        if (!result.newAmount) {
          twitchActionSay(`!addpoints ${username} ${points}`)
          return;
        }

        // Deu certo o token
        const reply = sprint.messageFinished
          .replace("@nome", `@${username}`)
          .replace("@resultado", points)
          .replace("@total", `${result.newAmount} ${config.loyalty}`);

        if (!silent || !sprint.implicitReedemSilent) twitchActionSay(reply);
      })
      .catch(() => {
        if (tries === 0) {
          // add participant back to the store
          dispatch({
            type: PARTICIPANT_ADD,
            participant,
          });
          return;
        }

        // keep trying in loop
        setTimeout(() => loop(--tries), 5000);
      });
  };
  loop(50);
};

const minutos = ({ twitchActionSay, sprint, username, ranking }) => {
  if (!sprint.ranking) {
    return;
  }

  const index = ranking.findIndex((p) => p.username === username);

  if (index === -1) {
    twitchActionSay(`@${username} não está no ranking.`);
    return;
  }

  const participant = ranking[index];

  twitchActionSay(
    `@${username} possui ${participant.minutes} minutos e sua posição é ${
      index + 1
    }°. Último resgate: ${new Date(participant.updatedAt).toLocaleString()}.`
  );
  return;
};

const commands = {
  "!calcula": ({ twitchActionSay, message, username }) => {
    const valores = message
      .replace(new RegExp("[^0-9]", "g"), " ")
      .split(" ")
      .filter(Boolean);

    if (valores.length !== 3) {
      twitchActionSay(
        'Inválido, digite nessa ordem: "se 100 bits = 5min, quantos são 20 bits?"'
      );
      return;
    }

    const valor = valores[0];
    const minutos = valores[1];
    const doado = valores[2];

    const resultado = String((doado * minutos) / valor).replace(".", ",");
    twitchActionSay(`A ação de @${username} resulta em ${resultado}`);
  },
  "!acaba": ({ twitchActionSay, message, username }) => {
    const valores = message
      .replace(new RegExp("[^0-9]", "g"), " ")
      .split(" ")
      .filter(Boolean);

    if (valores.length !== 1) {
      twitchActionSay('Inválido, digite somente com horas, exemplo: "em 48h"');
      return;
    }

    const horas = valores[0];

    const tempoAtual = moment().locale("pt-br").add(horas, "hours");

    twitchActionSay(
      `Vai acabar em ${tempoAtual.format("LLL")} (${tempoAtual.format("dddd")})`
    );
  },
  "!unlivro": ({ twitchActionSay, message, username }) => {
    const paginas = message
      .replace(new RegExp("[^0-9]", "g"), " ")
      .split(" ")
      .filter(Boolean);

    if (paginas.length !== 3) {
      twitchActionSay(
        'Inválido, digite nessa ordem: "possui 300, começa na 20 e estou na 50"'
      );
      return;
    }

    const total = paginas[0];
    const inicio = paginas[1];
    const atual = paginas[2];

    const totalReal = total - inicio;
    const atualReal = atual - inicio;

    const porcentagem = ((atualReal / totalReal) * 100)
      .toFixed(2)
      .replace(".", ",");
    twitchActionSay(`@${username} já leu ${porcentagem}% do livro`);
  },
  "!unsprint": ({ twitchActionSay }) => {
    twitchActionSay(
      `unSprint é um jogo onde todos sprintam, enquanto tiver no sprint você pode apenas falar no chat se tiver vidas e ao final os participantes ganharão pontos na lojinha. Para saber os comandos digite !uncomandos`
    );
  },
  "!uncomandos": ({ twitchActionSay }) => {
    twitchActionSay(
      `!unsprint / !iniciar / !vida / !tempo / !ganhei / !unranking`
    );
  },
  "!unranking": ({ twitchActionSay, sprint, ranking }) => {
    if (!sprint.ranking) {
      twitchActionSay(
        `Ranking desabilitado. Acesse configurações avançadas para ativar.`
      );
      return;
    }

    const top = ranking
      .slice(0, 3)
      .map((p, idx) => `${idx + 1}° ${p.username}`)
      .join(" / ");

    if (!top) {
      twitchActionSay(`Ninguém entrou no ranking ainda.`);
      return;
    }

    twitchActionSay(
      `Ranking atual: ${top}. Fique atento, pois os minutos serão zerados toda segunda-feira. Para conferir sua posição digite !minutos`
    );
  },
  "!ovo": () => {}, // ignora mensagem
  "!minutos": minutos,
  "!m": minutos,
  "!iniciar": iniciar,
  "!i": iniciar,
  "!ganhei": ganhei,
  "!g": ganhei,
  "!timer": ({ sprint, twitchActionSay }) => {
    if (sprint.ends) {
      const [, minutes] = calculatePoints(new Date(), sprint.ends);

      twitchActionSay(`Tempo restante: ${minutes} minutos.`);
      return;
    }
    twitchActionSay("Nenhum sprint está acontecendo.");
  },
  "!tempo": ({
    sprint,
    config,
    special,
    twitchActionSay,
    participant,
    username,
    isSubscriber,
    isVip,
  }) => {
    if (!participant) {
      twitchActionSay(sprint.messageAnxious.replace("@nome", `@${username}`));
      return;
    }

    const { joined } = participant;

    const multiplier = findBestMultiplier(
      username,
      sprint,
      isSubscriber,
      isVip,
      special
    );
    const [points, minutes] = calculatePoints(
      joined,
      sprint.ends || sprint.ended,
      multiplier
    );

    const reply = sprint.messageTime
      .replace("@nome", `@${username}`)
      .replace("@tempo", `${minutes}`)
      .replace("@resultado", `${points} ${config.loyalty}`);

    twitchActionSay(reply);
  },
  "!vida": ({
    message,
    sprint,
    twitchActionSay,
    dispatch,
    participant,
    username,
    isStreamer,
  }) => {
    // only show lives
    if (!message.includes(" ") && participant) {
      const { lives } = participant;
      const textLives = `vida${lives > 1 ? "s" : ""}`;

      twitchActionSay(`@${username} possui ${lives} ${textLives}.`);
      return;
    }

    if (!isStreamer) {
      return;
    }

    if (sprint.finished) {
      twitchActionSay(
        `@${username} só é possível dar vidas enquanto estiver acontecendo o sprint.`
      );
      return;
    }

    // host can add lives to everyone
    const lives = parseInt(message.split(" ")[1]);

    if (Number.isNaN(lives)) {
      twitchActionSay(`@${username} informe corretamente as vidas.`);
      return;
    } else {
      const reply = sprint.messageBonus.replace("@vida", `${lives} vida(s)`);
      twitchActionSay(reply);
      dispatch({
        type: PARTICIPANTS_ADD_LIVES,
        lives,
      });
    }
  },
  "!morte": ({
    twitchActionSay,
    sprint,
    dispatch,
    isMod,
    participant,
    username,
    userId,
  }) => {
    if (
      sprint.finished ||
      !sprint.ends ||
      !participant ||
      (sprint.modImmune && isMod)
    ) {
      return;
    }

    const { lives, joined } = participant;

    if (lives <= 1) {
      dispatch({
        type: PARTICIPANT_REMOVE,
        username,
      });

      const [, minutes] = calculatePoints(joined, sprint.ends || sprint.ended);

      twitchActionSay(
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
      twitchActionSay(
        `@${username} mandou mensagem no chat e perdeu 1 vida, restam ${
          lives - 1
        } vida(s).`
      );
    }
  },
};

export default commands;
