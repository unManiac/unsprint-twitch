import { FOREST_UPDATE } from "../constants/actionTypes";
import { updateLang } from "../utils/lang";
import { segmentTrack } from "../utils/segment";

export function end(twitch) {
  return function (dispatch, getState) {
    const config = getState().configuration;

    dispatch({
      type: FOREST_UPDATE,
      ends: undefined,
    });

    segmentTrack("Forest - Encerrou tempo", {
      userId: config.channel,
    });

    const isEn = updateLang() === "en";

    twitch.actionSay(
      isEn ? `Forest room is now finished` : `Acabou o tempo da sala do Forest`
    );
  };
}
