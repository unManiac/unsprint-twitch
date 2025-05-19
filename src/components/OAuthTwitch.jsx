import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CONFIGURATION_UPDATE } from "../constants/actionTypes";

const OAuthTwitch = () => {
  const navigate = useNavigate();

  const url = window.location.href;
  const regexp = /access_token=([^&]+)/;
  const accessToken = regexp.exec(url)[1];

  const dispatch = useDispatch();
  const config = useSelector((state) => state.configuration);


  useEffect(() => {
    if (!accessToken) {
      return;
    }

    dispatch({
      type: CONFIGURATION_UPDATE,
      configuration: {
        ...config,
        oauth: `oauth:${accessToken}`,
      },
    });

    navigate("/config");
  }, [accessToken])
};

export default OAuthTwitch;
