import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import tmi from "tmi.js";

// This component will send messages from the store only when the main client is connected
// it allows to check if action was received and remove from store
function SprintMessage() {
  const [client, setClient] = useState();

  const config = useSelector((state) => state.configuration);
  const messages = useSelector((state) => state.message.list);

  const firstMessage = messages[0];

  useEffect(() => {
    const client = new tmi.client({
      identity: {
        username: config.channel,
        password: config.oauth,
      },
      channels: [config.channel],
    });

    client.on("message", console.log);

    client
      .connect()
      .then(() => setClient(client))
      .catch(() => setClient(null));
  }, [config?.oauth, config?.channel]);

  useEffect(() => {
    if (!firstMessage || !client) {
      return;
    }

    client.action(config.channel, firstMessage);

    // eslint-disable-next-line
  }, [firstMessage, client]);

  return null;
}

export default SprintMessage;
