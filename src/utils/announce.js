export function action(configuration, msg, enableForest) {
  if (
    (configuration.enableAnnounce && !enableForest) ||
    (configuration.enableAnnounceForest && enableForest)
  ) {
    return `/announce ${msg}`;
  }
  return `/me ${msg}`;
}
