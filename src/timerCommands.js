import { cancel, end, startTime } from "./actions/sprint";

const commands = {
  "!un": async ({ twitch, dispatch, message }) => {
    const parts = message.split(" ");
    if (parts.length <= 1) {
      return;
    }

    const parameter = parts[1];
    const minutes = parseInt(parameter);

    // time
    if (!Number.isNaN(minutes)) {
      dispatch(startTime(twitch, minutes, true));
      return;
    } else if (parameter.startsWith("encerra") || parameter.startsWith("fim")) {
      dispatch(end(twitch, true));
      return;
    } else if (parameter.startsWith("cancela")) {
      dispatch(cancel(true));
      return;
    } else if (parameter.startsWith("atualiza")) {
      window.location.reload();
    }
  },
};

export default commands;
