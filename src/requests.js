export function addPoints(username, points, config) {
  return fetch(
    `https://api.streamelements.com/kappa/v2/points/${
      config.channelId
    }/${username}/${parseInt(points)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    }
  ).then((resp) => resp.json());
}
