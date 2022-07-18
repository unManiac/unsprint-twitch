import { cancel, end, startTime } from "./actions/sprint";
import {
  CONFIGURATION_UPDATE,
  PARTICIPANTS_ADD_LIVES,
  RANKING_RESET,
  SPRINT_PARTIAL_UPDATE,
  VIP_ADD_PERSON,
  VIP_REMOVE_PERSON,
  VIP_UPDATE,
} from "./constants/actionTypes";
import { getStoreItems, updateStoreItem } from "./requests";

const commands = {
  "!un": async ({
    isStreamer,
    twitch,
    target,
    dispatch,
    config,
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
    } else if (parameter.startsWith("rankingreset") && parts.length > 2) {
      if (!["on", "off", "reiniciar"].includes(parts[2])) {
        return;
      }
      if (parts[2] === "reiniciar") {
        dispatch({
          type: RANKING_RESET,
        });
        twitchActionSay(`Ranking reiniciado.`);
        return;
      }

      const disableResetRanking = parts[2] === "off";
      dispatch({
        type: SPRINT_PARTIAL_UPDATE,
        sprint: {
          disableResetRanking,
        },
      });

      if (disableResetRanking) {
        twitchActionSay(`Ranking NÃO será mais resetado.`);
      } else {
        twitchActionSay(`Ranking será resetado na segunda-feira.`);
      }
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
    } else if (parameter.startsWith("zeravip")) {
      dispatch({
        type: VIP_UPDATE,
        list: [],
      });
      twitchActionSay(`${username} foi zerado a lista de vips.`);
    } else if (parameter.startsWith("loja") && parts.length > 2) {
      const action = parts[2];
      if (action.startsWith("pausa")) {
        twitchActionSay(`Pausando lojinha...`);
        const items = await getStoreItems(config).then((items) =>
          items.filter((item) => item.enabled && item.quantity.current !== 0)
        );

        // Save reference
        localStorage.setItem("lojinha", JSON.stringify(items));

        // Update items
        await Promise.all(
          items.map((item) =>
            updateStoreItem(
              item._id,
              {
                ...item,
                enabled: false,
              },
              config
            )
          )
        );

        twitchActionSay(`Desabilitado ${items.length} itens na lojinha.`);
      } else if (action.startsWith("restaura")) {
        let items = localStorage.getItem("lojinha");

        if (!items) {
          twitchActionSay(`Nenhum item encontrado.`);
          return;
        }
        twitchActionSay(`Restaurando lojinha...`);

        items = JSON.parse(items);

        // Update items
        await Promise.all(
          items.map((item) =>
            updateStoreItem(
              item._id,
              {
                ...item,
                enabled: true,
              },
              config
            )
          )
        );

        twitchActionSay(`Restaurado ${items.length} itens na lojinha.`);
        localStorage.removeItem("lojinha");
      }
    } else if (parameter.startsWith("announce") && parts.length > 2) {
      const action = parts[2];
      if (action.startsWith("on")) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: {
            enableAnnounce: true,
          },
        });
        twitchActionSay(`Habilitado /announce no bot`);
      } else if (action.startsWith("off")) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: {
            enableAnnounce: false,
          },
        });
        twitchActionSay(`Bot não irá mais utilizar /announce`);
      } else {
        twitchActionSay(`Comandos são !un announce on / !un announce off`);
      }
    }
  },
};

export default commands;
