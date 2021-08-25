import { MESSAGE_ADD, MESSAGE_REMOVE } from "../constants/actionTypes";

const message = (state = { list: [] }, action) => {
  switch (action.type) {
    case MESSAGE_ADD:
      return {
        ...state,
        list: [...state.list, action.message],
      };
    case MESSAGE_REMOVE:
      return {
        ...state,
        list: [...state.list.filter((msg) => msg !== action.message)],
      };
    default:
      return state;
  }
};

export default message;
