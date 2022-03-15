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

export function getStoreItems(config) {
  return fetch(
    `https://api.streamelements.com/kappa/v2/store/${config.channelId}/items`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    }
  ).then((resp) => resp.json());
}

export function updateStoreItem(id, item, config) {
  return fetch(
    `https://api.streamelements.com/kappa/v2/store/${config.channelId}/items/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(item),
    }
  ).then((resp) => resp.json());
}
