export function segmentIdentify(channel) {
  try {
    if (window.analytics && window.analytics?.user().id() !== channel) {
      window.analytics.identify(channel, {});
    }
  } catch (err) {
    console.log(err);
  }
}

export function segmentTrack(name, params) {
  try {
    window.analytics?.track(name, params);
  } catch (err) {
    console.log(err);
  }
}
