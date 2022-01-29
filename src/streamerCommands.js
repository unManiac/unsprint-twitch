import { cancel, end, startTime } from "./actions/sprint";
import {
  PARTICIPANTS_ADD_LIVES,
  RANKING_RESET,
  SPRINT_PARTIAL_UPDATE,
  VIP_ADD_PERSON,
  VIP_REMOVE_PERSON,
} from "./constants/actionTypes";

const commands = {
  "!un": ({
    isStreamer,
    twitch,
    target,
    dispatch,
    special,
    sprint,
    twitchActionSay,
    username,
    message,
  }) => {
    const parts = message.split(" ");
    if (parts.length <= 1) {
      return;
    }

    const parameter = parts[1];
    const minutes = parseInt(parameter);

    // time
    if (!Number.isNaN(minutes)) {
      dispatch(startTime(twitch, minutes));
      return;
    } else if (parameter.startsWith("encerra") || parameter.startsWith("fim")) {
      dispatch(end(twitch));
      return;
    } else if (parameter.startsWith("cancela")) {
      dispatch(cancel());
      twitchActionSay("Sprint cancelado!");
      return;
    } else if (parameter.startsWith("comando")) {
      twitchActionSay(
        `Iniciar ou alterar o tempo digite "!un XX", onde XX são os minutos. Vida extra digite "!un vida X", onde X é o número de vidas. Encerrar o sprint digite "!un encerrar" e caso queira cancelar digite "!un cancelar"`
      );
      return;
    } else if (parameter.startsWith("vida") && parts.length > 2) {
      if (isStreamer && ["on", "off"].includes(parts[2])) {
        const allImmune = parts[2] === "off";
        dispatch({
          type: SPRINT_PARTIAL_UPDATE,
          sprint: {
            allImmune,
          },
        });

        if (allImmune) {
          twitchActionSay(`Imunidade geral ativada.`);
        } else {
          twitchActionSay(`Imunidade geral desativada.`);
        }
        return;
      }

      const lives = parseInt(parts[2]);
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
    } else if (parameter.startsWith("rankingreseta")) {
      dispatch({
        type: RANKING_RESET,
      });
    } else if (parameter.startsWith("atualiza")) {
      window.location.reload();
    } else if (parameter.startsWith("reconfigura")) {
      localStorage.removeItem("unconfig");
      window.location.reload();
    } else if (parameter.startsWith("vips")) {
      twitch.say(
        target,
        `Lista de vips ganhando ${special.multiplier}x: ${special.list.join(
          ", "
        )}`
      );
    } else if (parameter.startsWith("addvip") && parts.length > 2) {
      const username = parts[2]
        .toLowerCase()
        .replace(new RegExp("@", "g"), "")
        .trim();

      if (special.list.includes(username)) {
        twitchActionSay(`${username} já existe na lista.`);
        return;
      }

      dispatch({
        type: VIP_ADD_PERSON,
        username,
      });
      twitchActionSay(`${username} foi adicionado na lista de vips.`);
    } else if (parameter.startsWith("removevip") && parts.length > 2) {
      const username = parts[2]
        .toLowerCase()
        .replace(new RegExp("@", "g"), "")
        .trim();

      if (!special.list.includes(username)) {
        twitchActionSay(`${username} não existe na lista.`);
        return;
      }

      dispatch({
        type: VIP_REMOVE_PERSON,
        username,
      });
      twitchActionSay(`${username} foi removido na lista de vips.`);
    }
  },
};

export default commands;
