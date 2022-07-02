import { BATCH_ADD, BATCH_REMOVE } from "../constants/actionTypes";

const batch = (state = { list: [] }, action) => {
  switch (action.type) {
    case BATCH_ADD:
      return {
        ...state,
        list: [...state.list, ...action.batch],
      };
    case BATCH_REMOVE:
      return {
        ...state,
        list: [...state.list.filter((l) => !action.uuids.include(l.uuid))],
      };
    default:
      return state;
  }
};

export default batch;
