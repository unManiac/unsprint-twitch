import {
  RANKING_RESET,
  RANKING_PARTICIPANT_ADD,
  RANKING_UPDATE,
  RANKING_PARTICIPANT_UPDATE,
} from "../constants/actionTypes";
import { getLastMonday, sortRanking } from "../helper";

const ranking = (state = { lastReset: getLastMonday(), list: [] }, action) => {
  let participant, existing;

  switch (action.type) {
    case RANKING_PARTICIPANT_ADD:
      participant = action.participant;

      existing = state.list.find((p) => p.username === participant.username);

      if (existing) {
        participant.minutes =
          parseInt(participant.minutes) + parseInt(existing.minutes);
      }

      participant.updatedAt = Date.now();

      return {
        ...state,
        list: sortRanking([
          ...state.list.filter((p) => p.username !== participant.username),
          participant,
        ]),
      };
    case RANKING_PARTICIPANT_UPDATE:
      participant = action.participant;

      existing =
        state.list.find((p) => p.username === participant.username) || {};

      return {
        ...state,
        list: sortRanking([
          ...state.list.filter((p) => p.username !== participant.username),
          { ...existing, ...participant },
        ]),
      };
    case RANKING_UPDATE:
      return {
        ...state,
        ...action.ranking,
      };
    case RANKING_RESET:
      return {
        ...state,
        lastReset: Date.now(),
        list: [],
      };
    default:
      return state;
  }
};

export default ranking;
