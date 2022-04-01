export function action(configuration, msg) {
  if (configuration.disableAnnounce) {
    return `/me ${msg}`;
  }
  return `/announce ${msg}`;
}
