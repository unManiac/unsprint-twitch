import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tmi from "tmi.js";
import commands from "./commands";
import {
  CONFIGURATION_UPDATE,
  MESSAGE_ADD,
  MESSAGE_REMOVE,
} from "./constants/actionTypes";
import { store } from "./store";

let externalClient = null;

function useTmi() {
  const [client, setClient] = useState(null);
  const [failed, setFailed] = useState(false);
  const [connected, setConnected] = useState(false);

  const dispatch = useDispatch();
  const config = useSelector((state) => state.configuration);

  useEffect(() => {
    setFailed(false);
    setConnected(false);
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
    client.on("action", onActionHandler);
    client.on("reconnect", () => setConnected(false));

    client
      .connect()
      .then(() => {
        setFailed(false);
        setClient(client);
      })
      .catch(() => {
        setFailed(true);
        setClient(null);
        setConnected(false);
      });
  };

  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self) {
    if (self) {
      return;
    } // Ignore messages from the bot

    const { username } = context;

    const message = msg.toLowerCase().trim();

    // fresh state
    const { sprint, configuration, participant, ranking } = store.getState();

    const badges = context.badges || {};

    const isStreamer = username === target.replace("#", "");
    const isAction = context["message-type"] === "action";

    if (isAction && isStreamer) {
      return;
    }

    const params = {
      twitch: this,
      twitchSafeSay: async (message) => {
        dispatch({ type: MESSAGE_ADD, message });
      },
      dispatch,
      username,
      message,
      target,
      config: configuration,
      sprint,
      participants: participant.list,
      ranking: ranking.list,
      participant: participant.list.find((p) => p.username === username),
      isMod: context.mod,
      isVip: !!badges["vip"],
      isSubscriber: context.subscriber,
      isStreamer,
    };

    const keyCommands = Object.keys(commands);
    let found = false;

    for (let i = 0; i < keyCommands.length; i++) {
      const key = keyCommands[i];
      // Prevent regular users to send extra text after the command, streamer is allowed
      if (message === key || (isStreamer && message.startsWith(key))) {
        commands[key]({ ...params, hasExtraText: message !== key });
        found = true;
        break;
      }
    }

    // Free comments in chat will lose a life
    if (!found) {
      commands["!morte"](params);
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    console.log("tmi connected");
    setConnected(true);
    // Update channel to be same as user
    const channel = this.username;

    if (channel?.toLowerCase() !== config.channel?.toLowerCase()) {
      dispatch({
        type: CONFIGURATION_UPDATE,
        configuration: { channel },
      });
    }
  }

  // Handles SprintMessage component sending messages
  function onActionHandler(target, context, msg, self) {
    if (self) {
      return;
    } // Ignore messages from the bot

    const { username } = context;

    self = username === target.replace("#", "");
    if (self) {
      dispatch({
        type: MESSAGE_REMOVE,
        message: msg,
      });
    }
  }

  return [client, failed, connected];
}

export default useTmi;
