import {
  RANKING_RESET,
  RANKING_PARTICIPANT_ADD,
  RANKING_UPDATE,
} from "../constants/actionTypes";
import { getLastMonday, sortRanking } from "../helper";

const ranking = (state = { lastReset: getLastMonday(), list: [] }, action) => {
  switch (action.type) {
    case RANKING_PARTICIPANT_ADD:
      const { participant } = action;

      const existing = state.list.find(
        (p) => p.username === participant.username
      );

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
