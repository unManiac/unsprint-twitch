export function action(configuration, msg, enableForest) {
  // desabilitado por hora
  // if (
  //   (configuration.enableAnnounce && !enableForest) ||
  //   (configuration.enableAnnounceForest && enableForest)
  // ) {
  //   return `/announce ${msg}`;
  // }
  return `/me ${msg}`;
}
