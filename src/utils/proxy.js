export function forestFetch(path, options) {
  const baseUrl =
    "https://ffh72tsevy5ymqmm2ezr5u7qe40edbhq.lambda-url.us-east-1.on.aws/api/v1";

  return fetch(`${baseUrl}/${path}`, options).then((resp) => {
    if (resp.status < 300) {
      try {
        return resp.json();
      } catch (err) {
        return resp.text();
      }
    }
    throw Error(resp.statusText);
  });
}
