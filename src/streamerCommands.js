import { cancel, end, startTime } from "./actions/sprint";

const commands = {
  "!un": ({ twitch, dispatch, twitchActionSay, message }) => {
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
    }
  },
};

export default commands;
