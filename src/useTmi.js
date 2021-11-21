import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tmi from "tmi.js";
import commands, { dict } from "./commands";
import streamerCommands from "./streamerCommands";
import { CONFIGURATION_UPDATE } from "./constants/actionTypes";
import { store } from "./store";

let externalClient = null;

function useTmi() {
  const [client, setClient] = useState(null);
  const [failed, setFailed] = useState(false);

  const dispatch = useDispatch();
  const config = useSelector((state) => state.configuration);

  useEffect(() => {
    setFailed(false);
    connect(config);

    return () => {
      externalClient?.disconnect();
    };
    // eslint-disable-next-line
  }, [config?.oauth, config?.channel, setFailed]);

  const connect = (config) => {
    externalClient?.disconnect();
    const client = new tmi.client({
      identity: {
        username: config.channel,
        password: config.oauth,
      },
      channels: [config.channel],
    });
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
      .catch(() => {
        setFailed(true);
        setClient(null);
      });
  };

  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self) {
    if (self) {
      return;
    } // Ignore messages from the bot

    const { username } = context;

    let message = msg.toLowerCase().trim();
    message = Object.keys(dict).reduce(
      (msg, k) => msg.replace(dict[k], k),
      message
    );

    // fresh state
    const { sprint, configuration, participant, ranking, vip } =
      store.getState();

    const badges = context.badges || {};

    const isStreamer = username === target.replace("#", "");
    const params = {
      twitch: this,
      dispatch,
      twitchActionSay: (msg) => {
        if (!msg) return;
        this.action(target, msg);
      },
      username,
      message,
      target,
      config: configuration,
      sprint,
      participants: participant.list,
      ranking: ranking.list,
      participant: participant.list.find((p) => p.username === username),
      isMod: "moderator" in badges,
      isVip: "vip" in badges,
      isSubscriber: "subscriber" in badges || "founder" in badges,
      isStreamer,
      special: vip,
    };

    const keyCommands = Object.keys(commands);
    const streamerKeyCommands = Object.keys(streamerCommands);
    let found = false;

    // shade
    if (message.startsWith("!iniciar ") || message.startsWith("!sprint ")) {
      let parts = message.split(" ");
      if (
        parts.length === 2 &&
        parts[1].length === 2 && // double digits
        !Number.isNaN(parseInt(parts[1])) // minutes
      ) {
        params.twitchActionSay(
          `@${username} aqui o bot é simples e portanto não precisa digitar minutos, digite apenas !iniciar sem precisar calcular o tempo.`
        );
        return;
      }
    }

    const canUseStreamerCommand = isStreamer || sprint.modCanControlBot;
    if (canUseStreamerCommand) {
      for (let i = 0; i < streamerKeyCommands.length; i++) {
        const key = streamerKeyCommands[i];
        if (message.startsWith(key)) {
          streamerCommands[key](params);
          found = true;
          break;
        }
      }
    }

    for (let i = 0; i < keyCommands.length && !found; i++) {
      const key = keyCommands[i];
      // Prevent regular users to send extra text after the command
      if (message === key) {
        commands[key]({ ...params, hasExtraText: message !== key });
        found = true;
        break;
      }
    }

    if (!found) {
      if (isStreamer && message.startsWith("!vida")) {
        commands["!vida"](params);
      } else if (sprint.finished) {
        // By default redeem points
        commands["!ganhei"]({ ...params, silent: true });
      } else {
        // Free comments in chat will lose a life
        commands["!morte"](params);
      }
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    // Update channel to be same as user
    const channel = this.username;

    if (channel?.toLowerCase() !== config.channel?.toLowerCase()) {
      dispatch({
        type: CONFIGURATION_UPDATE,
        configuration: { channel },
      });
    }
  }

  return [client, failed];
}

export default useTmi;
