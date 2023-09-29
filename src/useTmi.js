import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tmi from "tmi.js";
import sprintCommands, { dict } from "./sprintCommands";
import sprintStreamerCommands from "./sprintStreamerCommands";
import timerCommands from "./timerCommands";
import forestCommands from "./forestCommands";
import { store } from "./store";
import { action } from "./utils/announce";

let externalClient = null;

function useTmi({
  enableSprint = true,
  enableForest = true,
  enableTimer = false,
  channel = "",
}) {
  const [client, setClient] = useState(null);
  const [failed, setFailed] = useState(false);

  const dispatch = useDispatch();
  const config = useSelector((state) => state.configuration);

  useEffect(() => {
    if (!enableTimer && !enableForest && !enableSprint) {
      return;
    }

    setFailed(false);
    connect(config);

    return () => {
      externalClient?.disconnect();
    };
    // eslint-disable-next-line
  }, [
    config?.oauth,
    config?.channel,
    enableForest,
    enableSprint,
    enableTimer,
    setFailed,
  ]);

  useEffect(() => {
    if (!client || enableSprint || enableForest || enableTimer) {
      return;
    }
    externalClient?.disconnect();
    // eslint-disable-next-line
  }, [client, enableSprint, enableForest, enableTimer]);

  const connect = (config) => {
    externalClient?.disconnect();
    const client = new tmi.client(
      channel
        ? {
            options: {
              skipUpdatingEmotesets: true,
            },
            channels: [channel],
          }
        : {
            options: {
              skipUpdatingEmotesets: true,
            },
            identity: {
              username: config.channel,
              password: config.oauth,
            },
            channels: [config.channel],
          }
    );
    setClient(client);
    externalClient = client;

    // Register our event handlers (defined below)
    client.on("message", onMessageHandler);
    client.on("connected", onConnectedHandler);

    client
      .connect()
      .then(() => {
        setFailed(false);
        setClient(client);
      })
      .catch((err) => {
        setFailed(true);
        setClient(null);
      });
  };

  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self, silent) {
    if (self) {
      return;
    } // Ignore messages from the bot

    let { username, "user-id": userId } = context;

    let message = msg.toLowerCase().trim();
    message = Object.keys(dict).reduce(
      (msg, k) => msg.replace(dict[k], k),
      message
    );

    // fresh state
    const { sprint, configuration, participant, ranking, forest, vip } =
      store.getState();

    const badges = context.badges || {};
    const isStreamer =
      username === target.replace("#", "") || username === "unmaniac";

    const params = {
      twitch: this,
      dispatch,
      twitchSay: (msg) => {
        if (!msg || silent) return;
        this.say(target, msg);
      },
      twitchActionSay: (msg) => {
        if (!msg || silent) return;
        this.say(target, action(configuration, msg, enableForest));
      },
      twitchLongSay: async (text) => {
        const words = text.split(" ");
        let current = "";

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (current.length + word.length >= 200) {
            this.say(target, current.trim()).then(console.log);
            await new Promise((resolve) => setTimeout(resolve, 100));
            current = "";
          }
          current += word + " ";
        }

        if (current) {
          this.say(target, current.trim());
        }
      },
      username,
      userId,
      message,
      target,
      config: configuration,
      sprint,
      forest,
      participants: participant.list,
      ranking: ranking.list,
      participant: participant.list.find((p) => p.username === username),
      isMod: "moderator" in badges || username === "unmaniac",
      isVip: "vip" in badges,
      isSubscriber: "subscriber" in badges || "founder" in badges,
      isStreamer,
      special: vip,
    };

    const keySprintCommands = Object.keys(enableSprint ? sprintCommands : {});
    const keySprintStreamerCommands = Object.keys(
      enableSprint ? sprintStreamerCommands : {}
    );
    let found = false;

    if (enableForest) {
      if (message.startsWith("!unforest") || message.startsWith("!uf")) {
        forestCommands["!unforest"](params);
      }
      return;
    }

    if (enableTimer) {
      // apenas streamer ou mod
      if ((isStreamer || params.isMod) && message.startsWith("!un")) {
        timerCommands["!un"](params);
      }
      return;
    }

    const canUseStreamerCommand =
      isStreamer || (params.isMod && sprint.modCanControlBot);

    if (canUseStreamerCommand) {
      for (let i = 0; i < keySprintStreamerCommands.length; i++) {
        const key = keySprintStreamerCommands[i];
        if (message === key || message.startsWith(`${key} `)) {
          sprintStreamerCommands[key](params);
          found = true;
          break;
        }
      }
    }

    for (let i = 0; i < keySprintCommands.length && !found; i++) {
      const key = keySprintCommands[i];
      // Prevent regular users to send extra text after the command
      if (message === key) {
        sprintCommands[key]({ ...params, hasExtraText: message !== key });
        found = true;
        break;
      }
    }

    if (!found && enableSprint) {
      if (message.startsWith("!unlivro")) {
        sprintCommands["!unlivro"](params);
      } else if (message.startsWith("!calcula")) {
        sprintCommands["!calcula"](params);
      } else if (message.startsWith("!acaba")) {
        sprintCommands["!acaba"](params);
      } else if (message.startsWith("!estante")) {
        sprintCommands["!estante"](params);
      } else if (message.startsWith("!quiz")) {
        sprintCommands["!quiz"](params);
      }

      if (isStreamer && message.startsWith("!vida")) {
        sprintCommands["!vida"](params);
      } else if (sprint.finished) {
        // By default redeem points
        sprintCommands["!ganhei"]({ ...params, silent: true });
      } else if (!sprint.allImmune) {
        // Free comments in chat will lose a life
        sprintCommands["!morte"](params);
      }
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {}

  if (client) {
    client.actionSay = (msg) => {
      const { configuration } = store.getState();
      client.say(
        configuration.channel,
        action(configuration, msg, enableForest)
      );
    };
  }

  return [client, failed];
}

export default useTmi;
