import {
  PARTICIPANTS_ADD_LIVES,
  PARTICIPANTS_REMOVE_LIVE,
  PARTICIPANT_ADD,
  PARTICIPANT_REMOVE,
} from "./constants/actionTypes";
import { calculatePoints } from "./helper";

const commands = {
  "!unsprint": ({ twitch, target }) => {
    twitch.say(
      target,
      `/me unSprint é um jogo onde todos sprintam, enquanto tiver no sprint você pode apenas falar no chat se tiver vidas e ao final os participantes ganharão pontos na lojinha. Para saber os comandos digite !uncomandos`
    );
  },
  "!uncomandos": ({ twitch, target }) => {
    twitch.say(target, `/me !unsprint / !iniciar / !vida / !tempo / !ganhei`);
  },
  "!iniciar": ({
    twitch,
    target,
    sprint,
    config,
    participant,
    username,
    dispatch,
  }) => {
    if (participant) {
      twitch.say(target, `/me @${username} já está participando.`);
      return;
    }

    if (sprint.finished || !sprint.ends) {
      twitch.say(target, `/me @${username} chegou atrasado.`);
      return;
    }

    const joined = Date.now();
    const [points, minutes] = calculatePoints(
      joined,
      sprint.ends,
      sprint.multiplier
    );

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

    twitch.say(target, `/me ${reply}`);
    //twitch.whisper(username, reply);
  },
  "!tempo": ({ sprint, config, twitch, participant, username, target }) => {
    if (!participant) {
      twitch.say(target, `/me @${username} não está participando.`);
      return;
    }

    const { joined } = participant;

    const [points, minutes] = calculatePoints(
      joined,
      sprint.ends || sprint.ended,
      sprint.multiplier
    );

    twitch.say(
      target,
      `/me ${username} entrou com ${minutes} minutos e irá ganhar ${points} ${config.loyalty} no final.`
    );
  },
  "!vida": ({
    message,
    sprint,
    config,
    twitch,
    dispatch,
    participant,
    username,
    isStreamer,
    target,
  }) => {
    // only show lives
    if (!isStreamer) {
      if (participant) {
        const { lives } = participant;
        const textLives = `vida ${lives > 1 ? "s" : ""}`;

        twitch.say(target, `/me ${username} possui ${lives} ${textLives}.`);
      }
      return;
    }

    if (sprint.finished) {
      twitch.say(
        target,
        `/me @${username} só é possível dar vidas enquanto estiver acontecendo o sprint.`
      );
      return;
    }

    // host can add lives to everyone
    const lives = parseInt(message.split(" ")[1]);

    if (Number.isNaN(lives)) {
      twitch.say(target, `/me ${username} informe corretamente as vidas.`);
      return;
    } else {
      const reply = sprint.messageBonus.replace("@vida", `${lives} vida(s)`);
      twitch.say(target, `/me ${reply}`);
      dispatch({
        type: PARTICIPANTS_ADD_LIVES,
        lives,
      });
    }
  },
  "!ganhei": ({
    participant,
    target,
    dispatch,
    config,
    sprint,
    twitch,
    username,
  }) => {
    if (!sprint.finished) {
      twitch.say(target, `/me @${username} o tempo ainda não acabou.`);
      return;
    }

    if (!participant) {
      twitch.say(target, `/me @${username} não está participando.`);
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

    const [points] = calculatePoints(joined, sprint.ended, sprint.multiplier);

    const loop = async (tries) => {
      fetch(
        `https://api.streamelements.com/kappa/v2/points/${config.channelId}/${username}/${points}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${config.token}`,
          },
        }
      )
        .then((resp) => resp.json())
        .then((result) => {
          twitch.say(
            target,
            `/me @${username} sobreviveu e ganhou ${points}. Seu novo total é ${result.newAmount} ${config.loyalty}.`
          );
          dispatch({
            type: PARTICIPANT_REMOVE,
            username,
          });
        })
        .catch(() => {
          // keep trying in loop
          setTimeout(() => loop(--tries), 5000);
          // tell unmaniac we have a problem
          twitch.whisper(
            "unmaniac",
            `/me Erro para atribuir pontos para o usuário ${username}`
          );
        });
    };
    loop(50);
  },
  "!morte": ({
    twitch,
    sprint,
    dispatch,
    isMod,
    participant,
    target,
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
      twitch.say(
        target,
        `/me @${username} não sobreviveu, digite !iniciar novamente para recomeçar na partida.`
      );
      return;
    }

    dispatch({
      type: PARTICIPANTS_REMOVE_LIVE,
      username,
      lives: 1,
    });

    if (sprint.warnMissingLives) {
      twitch.say(
        target,
        `/me @${username} mandou mensagem no chat e perdeu 1 vida, restam ${
          lives - 1
        } vida(s).`
      );
    }
  },
};

export default commands;
