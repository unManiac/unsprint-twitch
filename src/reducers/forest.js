import { FOREST_UPDATE } from "../constants/actionTypes";

const forest = (
  state = { roomId: 0, roomToken: "", duration: 3600, treeType: 0, trees: [] },
  action
) => {
  switch (action.type) {
    case FOREST_UPDATE:
      return {
        ...state,
        ...action,
      };
    default:
      return state;
  }
};

export default forest;
