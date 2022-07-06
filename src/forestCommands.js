import { CONFIGURATION_UPDATE, FOREST_UPDATE } from "./constants/actionTypes";
import { arvores } from "./utils/arvores";
import { forestFetch } from "./utils/proxy";

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
    const parts = message.split(" ");

    const joinMessage = `Entre no Forest: https://forestapp.cc/join-room/?token=`;
    const allowed = isStreamer || isMod;

    if (parts.length === 1) {
      // reenviar link da sala
      if (forest.roomToken) {
        twitchActionSay(`${joinMessage}${forest.roomToken}`);
      } else if (allowed) {
        twitchActionSay(`Digite "!unforest sala" pra criar uma nova sala.`);
      }
      return;
    }

    if (!allowed) {
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
        const trees = data
          .map((d) => ({
            id: d.gid,
            title: findTitle(d.gid) || d.title.trim(),
            titleOriginal: d.title.trim(),
          }))
          .sort((a, b) => a.id - b.id);

        dispatch({
          type: FOREST_UPDATE,
          trees,
        });

        window.analytics?.track("Forest - Listagem", {
          userId: config.channel,
          email: config.forestEmail,
          trees,
        });

        twitchSay(
          `As opções disponíveis são: ${trees
            .map((t) => `[${t.id}] ${t.title}`)
            .join(" / ")
            .trim()}`
        );
      });
      return;
    } else if (parameter.startsWith("arvore") && parts.length > 2) {
      const arvore = message.split(" arvore ")[1].trim().toLowerCase();
      const codigo = Number.parseInt(arvore);

      const found = findArvore(arvore, codigo, forest.trees);

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
          roomToken: data.token,
          roomId: data.id,
        });

        for (let i = 0; i < 5; i++)
          twitchActionSay(`${joinMessage}${data.token}`);
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
    } else if (parameter.startsWith("atualiza")) {
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
