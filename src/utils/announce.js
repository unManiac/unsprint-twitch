export function action(configuration, msg) {
  if (configuration.enableAnnounce) {
    return `/announce ${msg}`;
  }
  return `/me ${msg}`;
}
