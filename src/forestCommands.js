import { FOREST_UPDATE } from "./constants/actionTypes";
import { forestFetch } from "./utils/proxy";

const commands = {
  "!unforest": async ({
    dispatch,
    config,
    forest,
    twitchActionSay,
    message,
  }) => {
    const parts = message.split(" ");

    const joinMessage = `Entre no Forest: https://forestapp.cc/join-room/?token=`;

    if (parts.length === 1) {
      // reenviar link da sala
      if (forest.roomToken) {
        twitchActionSay(`${joinMessage}${forest.roomToken}`);
      } else {
        twitchActionSay(`Digite "!unforest sala" pra criar uma nova sala.`)
      }
      return;
    }

    const parameter = parts[1];

    if (parameter.startsWith("arvores")) {
      forestFetch("tree_types/unlocked", {
        headers: new Headers({
          token: `remember_token=${config.forestToken}`,
        }),
        method: "GET",
      }).then((data) => {
        const trees = data.map((d) => ({ id: d.gid, title: d.title.trim() }));

        dispatch({
          type: FOREST_UPDATE,
          trees,
        });

        window.analytics?.track("Forest - Listagem", {
          userId: config.channel,
          email: config.forestEmail,
          trees,
        });

        twitchActionSay(
          `As opções disponíveis são: ${trees.map((t) => t.title).join(", ")}`
        );
      });
      return;
    } else if (parameter.startsWith("arvore") && parts.length > 2) {
      const arvore = message.split(" arvore ")[1].trim().toLowerCase();

      const found = forest.trees.find((t) => t.title.toLowerCase() === arvore);

      if (!found) {
        twitchActionSay(
          `Nenhuma árvore encontrado usando o termo "${arvore}".`
        );
        return;
      }

      dispatch({
        type: FOREST_UPDATE,
        treeType: found.id,
      });

      window.analytics?.track("Forest - Atualizou árvore", {
        userId: config.channel,
        email: config.forestEmail,
        tree: found.title,
      });

      const roomId = forest.roomId;
      if (roomId) {
        forestFetch(`rooms/${roomId}`, {
          headers: new Headers({
            token: `remember_token=${config.forestToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          method: "PUT",
          body: `target_duration=${forest.duration}&tree_type=${found.id}`,
        }).then(() => {
          twitchActionSay(
            `Sala ${forest.roomToken} está plantando "${found.title}".`
          );
        });
      } else {
        twitchActionSay(`Árvore atualizada para "${found.title}"`);
      }
      return;
    } else if (parameter.startsWith("tempo") && parts.length > 2) {
      const minutos = Number.parseInt(
        message.split(" tempo ")[1].trim().toLowerCase()
      );

      if (Number.isNaN(minutos)) {
        twitchActionSay("Minutos inválidos");
        return;
      }

      window.analytics?.track("Forest - Atualizou tempo", {
        userId: config.channel,
        email: config.forestEmail,
        minutes: minutos,
      });

      if (minutos < 10 || minutos > 180 || minutos % 5 !== 0) {
        twitchActionSay(
          "Os minutos precisam ser entre 10 e 180, e múltiplos de 5."
        );
        return;
      }

      const duration = minutos * 60;

      dispatch({
        type: FOREST_UPDATE,
        duration,
      });

      const roomId = forest.roomId;
      if (roomId) {
        forestFetch(`rooms/${roomId}`, {
          headers: new Headers({
            token: `remember_token=${config.forestToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          method: "PUT",
          body: `target_duration=${duration}&tree_type=${forest.treeType}`,
        }).then(() => {
          twitchActionSay(
            `Sala ${forest.roomToken} com duração de "${minutos}" minutos.`
          );
        });
      } else {
        twitchActionSay(`Tempo atualizado para "${minutos}" minutos`);
      }
      return;
    } else if (parameter.startsWith("sala")) {
      forestFetch("rooms", {
        headers: new Headers({
          token: `remember_token=${config.forestToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        method: "POST",
        body: `target_duration=${forest.duration}&tree_type=${forest.treeType}`,
      }).then((data) => {
        dispatch({
          type: FOREST_UPDATE,
          roomId: data.id,
          roomToken: data.token,
        });

        window.analytics?.track("Forest - Nova sala", {
          userId: config.channel,
          email: config.forestEmail,
          token: data.token,
        });

        for (let i = 0; i < 5; i++)
          twitchActionSay(`${joinMessage}${data.token}`);
      });
      return;
    } else if (parameter.startsWith("remov")) {
      dispatch({
        type: FOREST_UPDATE,
        roomId: 0,
        roomToken: "",
      });

      window.analytics?.track("Forest - Remover sala", {
        userId: config.channel,
        email: config.forestEmail,
      });

      twitchActionSay(`Última sala criada foi removida.`);
      return;
    } else if (parameter.startsWith("ini")) {
      window.analytics?.track("Forest - Iniciou sala", {
        userId: config.channel,
        email: config.forestEmail,
        token: forest.roomToken,
      });

      forestFetch(`rooms/${forest.roomId}/start`, {
        headers: new Headers({
          token: `remember_token=${config.forestToken}`,
        }),
        method: "PUT",
      })
        .then(() => {
          twitchActionSay(`Sala ${forest.roomToken} iniciada.`);
        })
        .catch(() => {
          twitchActionSay(
            `Não foi possível iniciar a sala ${forest.roomToken}, precisa ter no mínimo 2 pessoas.`
          );
        });
      return;
    }
  },
};

export default commands;
