import { CONFIGURATION_UPDATE, FOREST_UPDATE } from "./constants/actionTypes";
import { discordMessage } from "./requests";
import { arvores } from "./utils/arvores";
import { updateLang } from "./utils/lang";
import { forestFetch } from "./utils/proxy";
import { segmentTrack } from "./utils/segment";

const findTitle = (id) => {
  return arvores.find((a) => a.id === `tree_type_${id}_title`)?.title;
};

const removeAcento = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const findArvore = (title, id, trees) => {
  if (!Number.isNaN(id)) {
    return trees.find((t) => t.id === id);
  }

  const titleTratado = removeAcento(title);

  let found = trees.find(
    (t) => removeAcento(t.title.toLowerCase()) === titleTratado
  );

  if (!found) {
    // busca pelo termo em inglês
    found = trees.find(
      (t) => removeAcento(t.titleOriginal.toLowerCase()) === titleTratado
    );
  }

  if (!found) {
    // busca por includes em pt
    found = trees.find((t) =>
      removeAcento(t.title.toLowerCase()).includes(titleTratado)
    );
  }

  if (!found) {
    // busca por includes em inglês
    found = trees.find((t) =>
      removeAcento(t.titleOriginal.toLowerCase()).includes(titleTratado)
    );
  }

  return found;
};

const commands = {
  "!unforest": async ({
    dispatch,
    config,
    forest,
    isStreamer,
    isMod,
    twitchActionSay,
    twitchSay,
    message,
  }) => {
    let isEn = localStorage.getItem("lang") === "en";
    const parts = message.split(" ");

    const jMsg = isEn ? `Join the room` : `Entre no Forest`;
    const joinMessage = `${jMsg}: https://forestapp.cc/join-room/?token=`;
    const allowed = isStreamer || isMod;

    if (parts.length === 1) {
      // reenviar link da sala
      if (forest.roomToken) {
        twitchActionSay(`${joinMessage}${forest.roomToken}`);
      } else if (allowed) {
        twitchActionSay(
          isEn
            ? `Type "!unforest room" to create a new room`
            : `Digite "!unforest sala" pra criar uma nova sala.`
        );
      }
      return;
    }

    if (!allowed) {
      return;
    }

    const { discordWebhook } = config;
    const discordClient = (msg) => discordMessage(discordWebhook, msg);

    const parameter = parts[1] || "";
    isEn = updateLang(parameter) === "en";

    if (parameter.startsWith("arvores") || parameter.startsWith("trees")) {
      forestFetch("tree_types/unlocked", {
        headers: new Headers({
          token: `remember_token=${config.forestToken}`,
        }),
        method: "GET",
      }).then((data) => {
        const trees = data
          .map((d) => ({
            id: d.gid,
            title: isEn ? d.title.trim() : findTitle(d.gid) || d.title.trim(),
            titleOriginal: isEn ? d.title.trim() : findTitle(d.gid),
          }))
          .sort((a, b) => a.id - b.id);

        dispatch({
          type: FOREST_UPDATE,
          trees,
        });

        segmentTrack("Forest - Listagem", {
          userId: config.channel,
          email: config.forestEmail,
          trees,
        });

        const msg = isEn ? "Options are" : "As opções disponíveis são";

        twitchSay(
          `${msg}: ${trees
            .map((t) => `[${t.id}] ${t.title}`)
            .join(" / ")
            .trim()}`
        );
      });
      return;
    } else if (
      (parameter.startsWith("arvore") || parameter.startsWith("tree")) &&
      parts.length > 2
    ) {
      const arvore = message
        .split(isEn ? " tree " : " arvore ")[1]
        .trim()
        .toLowerCase();
      const codigo = Number.parseInt(arvore);

      const found = findArvore(arvore, codigo, forest.trees);

      if (!found) {
        const msg = isEn
          ? "No tree found by"
          : "Nenhuma árvore encontrado usando o termo";
        twitchActionSay(`${msg} "${arvore}".`);
        return;
      }

      dispatch({
        type: FOREST_UPDATE,
        treeType: found.id,
      });

      segmentTrack("Forest - Atualizou árvore", {
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
            isEn
              ? `Room ${forest.roomToken} is now planting "${found.title}".`
              : `Sala ${forest.roomToken} está plantando "${found.title}".`
          );
        });
      } else {
        twitchActionSay(`Árvore atualizada para "${found.title}"`);
      }
      return;
    } else if (
      (parameter.startsWith("tempo") || parameter.startsWith("time")) &&
      parts.length > 2
    ) {
      const minutos = Number.parseInt(
        message
          .split(isEn ? " time " : " tempo ")[1]
          .trim()
          .toLowerCase()
      );

      if (Number.isNaN(minutos)) {
        twitchActionSay("Minutos inválidos");
        return;
      }

      segmentTrack("Forest - Atualizou tempo", {
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
            isEn
              ? `Room ${forest.roomToken} set to "${minutos}" minutes.`
              : `Sala ${forest.roomToken} com duração de "${minutos}" minutos.`
          );
        });
      } else {
        twitchActionSay(
          isEn
            ? `Time updated to "${minutos}" minutes`
            : `Tempo atualizado para "${minutos}" minutos`
        );
      }
      return;
    } else if (parameter.startsWith("sala") || parameter.startsWith("room")) {
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
          ends: undefined,
        });

        for (let i = 0; i < 3; i++)
          twitchActionSay(`${joinMessage}${data.token}`);

        discordClient(`${joinMessage}${data.token}`);

        segmentTrack("Forest - Nova sala", {
          userId: config.channel,
          email: config.forestEmail,
          roomToken: data.token,
          roomId: data.id,
        });
      });
      return;
    } else if (
      parameter.startsWith("remov") ||
      parameter.startsWith("exclu") ||
      parameter.startsWith("limpa")
    ) {
      dispatch({
        type: FOREST_UPDATE,
        roomId: 0,
        roomToken: "",
      });

      segmentTrack("Forest - Remover sala", {
        userId: config.channel,
        email: config.forestEmail,
      });

      twitchActionSay(
        isEn ? `Last room was removed.` : `Última sala criada foi removida.`
      );
      return;
    } else if (parameter.startsWith("ini") || parameter.startsWith("start")) {
      segmentTrack("Forest - Iniciou sala", {
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
          dispatch({
            type: FOREST_UPDATE,
            ends: Date.now() + forest.duration * 1000,
          });

          const msg = isEn
            ? `Room ${forest.roomToken} started.`
            : `Sala ${forest.roomToken} iniciada.`;

          twitchActionSay(msg);
          discordClient(msg);
        })
        .catch(() => {
          twitchActionSay(
            isEn
              ? `Not possible to start room ${forest.roomToken}, you need at least 2 people.`
              : `Não foi possível iniciar a sala ${forest.roomToken}, precisa ter no mínimo 2 pessoas.`
          );
        });
      return;
    } else if (
      parameter.startsWith("atualiza") ||
      parameter.startsWith("update")
    ) {
      window.location.reload();
    } else if (parameter.startsWith("announce") && parts.length > 2) {
      const action = parts[2];
      if (action.startsWith("on")) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: {
            enableAnnounceForest: true,
          },
        });
        twitchActionSay(`Habilitado /announce no forest`);
      } else if (action.startsWith("off")) {
        dispatch({
          type: CONFIGURATION_UPDATE,
          configuration: {
            enableAnnounceForest: false,
          },
        });
        twitchActionSay(`Bot não irá mais utilizar /announce no forest`);
      } else {
        twitchActionSay(
          `Comandos são !unforest announce on / !unforest announce off`
        );
      }
    }
  },
};

export default commands;
