import {
  PARTICIPANT_ADD,
  PARTICIPANTS_RESET,
  PARTICIPANT_REMOVE,
  PARTICIPANTS_ADD_LIVES,
  PARTICIPANTS_REMOVE_LIVE,
} from "../constants/actionTypes";

const participant = (state = { list: [] }, action) => {
  switch (action.type) {
    case PARTICIPANT_ADD:
      return {
        ...state,
        list: [
          ...state.list.filter(
            (p) => p.username !== action.participant.username // only one
          ),
          action.participant,
        ],
      };
    case PARTICIPANT_REMOVE:
      return {
        ...state,
        list: [...state.list.filter((p) => p.username !== action.username)],
      };
    case PARTICIPANTS_ADD_LIVES:
      return {
        ...state,
        list: state.list.map((p) => ({
          ...p,
          lives: parseInt(p.lives) + parseInt(action.lives),
        })),
      };
    case PARTICIPANTS_REMOVE_LIVE:
      return {
        ...state,
        list: state.list.map((p) => {
          if (p.username === action.username) {
            p.lives = parseInt(p.lives) - parseInt(action.lives);
          }
          return p;
        }),
      };
    case PARTICIPANTS_RESET:
      return {
        ...state,
        list: [],
      };
    default:
      return state;
  }
};

export default participant;
