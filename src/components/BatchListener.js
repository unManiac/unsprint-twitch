import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BATCH_REMOVE } from "../constants/actionTypes";
import { saveSprint } from "../requests";

function BatchListener() {
  const timeoutId = useRef(undefined);

  const dispatch = useDispatch();

  const config = useSelector((state) => state.configuration);
  const batches = useSelector((state) => state.batch.list);

  useEffect(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      if (batches.length) {
        saveSprint(config.oauth, batches);
      }
      dispatch({
        type: BATCH_REMOVE,
        uuids: batches.map((b) => b.uuid),
      });
    }, 15 * 1000); // 15s
    // eslint-disable-next-line
  }, [config.oauth, batches.map((b) => b.uuid).join(",")]);

  return null;
}

export default BatchListener;
