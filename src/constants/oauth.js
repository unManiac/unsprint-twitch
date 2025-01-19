const TWITCH_CLIENT_ID = "uv254wnx3p12yjbtf26glmd8xf1nfc";
const TWITCH_REDIRECT_URI = `${window.location.origin}/%23/oauth/twitch`;
const TWITCH_SCOPE = "chat%3Aedit+chat%3Aread";

export const TWITCH_AUTH_URL = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&scope=${TWITCH_SCOPE}&state=c3ab8aa609ea11e793ae92361f002671"`