import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CONFIGURATION_UPDATE } from '../constants/actionTypes';

const OAuthTwitch = () => {
  const url = window.location.href;
  const regexp = /access_token=([^&]+)/;
  const accessToken = regexp.exec(url)[1];

  const dispatch = useDispatch();
  const config = useSelector((state) => state.configuration);

  dispatch({
    type: CONFIGURATION_UPDATE,
    configuration: {
      ...config,
      oauth: `oauth:${accessToken}`,
    }
  });
    
  return (
    <Redirect to="/config" />
  );
};

export default OAuthTwitch;
