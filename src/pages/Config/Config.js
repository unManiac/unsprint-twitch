import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  lighten,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { CONFIGURATION_UPDATE } from "../../constants/actionTypes";
import { GREEN, WHITE } from "../../constants/colors";
import { TWITCH_AUTH_URL } from "../../constants/oauth";
import { forestFetch } from "../../utils/proxy";
import { segmentTrack } from "../../utils/segment";

const useStyles = makeStyles((theme) => ({
  root: {},
  step: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "0",
  },
  save: {
    backgroundColor: GREEN,
    color: WHITE,
    marginTop: 30,
    fontSize: 18,
    "&:hover,&:active,&:focus": {
      backgroundColor: lighten(GREEN, 0.3),
    },
  },
}));

function Config({ location }) {
  const classes = useStyles();

  const parameters = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const msg = parameters.get("msg");

  const dispatch = useDispatch();
  const config = useSelector((state) => state.configuration);

  const [oauth, setOauth] = useState(config.oauth);
  const [channel, setChannel] = useState(config.channel);
  const [token, setToken] = useState(config.token);
  const [loyalty, setLoyalty] = useState(config.loyalty);
  const [channelId, setChannelId] = useState(config.channelId);
  const [enableAnnounce, setEnableAnnounce] = useState(config.enableAnnounce);
  const [forestEmail, setForestEmail] = useState(config.forestEmail ?? "");
  const [forestPassword, setForestPassword] = useState(
    config.forestPassword ?? ""
  );
  const [discordWebhook, setDiscordWebhook] = useState(
    config.discordWebhook ?? ""
  );
  const [forestToken, setForestToken] = useState(config.forestToken ?? "");

  const [success, setSuccess] = useState(false);
  const [forestError, setForestError] = useState(false);
  const [forestLoading, setForestLoading] = useState(false);

  const validOauth = !!oauth && !oauth.startsWith("oauth:");
  const validToken = !!token && !token.startsWith("ey");

  useEffect(() => {
    if (token) {
      fetchMe(token);
    }
  }, [token]);

  useEffect(() => {
    if (channelId && token) {
      fetchLoyalty(channelId, token);
    }
  }, [channelId, token]);

  const fetchMe = (token) => {
    fetch("https://api.streamelements.com/kappa/v2/channels/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((me) => {
        setChannelId(me._id);
      });
  };

  const fetchLoyalty = (channelId, token) => {
    fetch(`https://api.streamelements.com/kappa/v2/loyalty/${channelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((channel) => {
        setLoyalty(channel.loyalty.name);
      });
  };

  const forestLogin = () => {
    setForestLoading(true);
    forestFetch(`sessions`, {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      method: "POST",
      body: JSON.stringify({
        session: { email: forestEmail, password: forestPassword },
      }),
    })
      .then((data) => {
        setForestError(false);
        setForestToken(data.remember_token);
      })
      .catch(() => {
        setForestError(true);
        setForestToken("");
      })
      .finally(() => {
        setForestLoading(false);
        segmentTrack("Forest - Validando usuário", {
          userId: channel,
          email: forestEmail,
        });
      });
  };

  const onSave = (e) => {
    e.preventDefault();

    setSuccess(false);
    dispatch({
      type: CONFIGURATION_UPDATE,
      configuration: {
        oauth,
        channel,
        token,
        loyalty,
        channelId,
        enableAnnounce,
        discordWebhook,
        forestEmail,
        forestPassword,
        forestToken,
      },
    });

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 500);
  };

  return (
    <form className={classes.root} onSubmit={onSave}>
      {success && (
        <Alert severity="success" style={{ marginTop: 20 }}>
          Configurações salvas com sucesso.
        </Alert>
      )}

      {!success && msg && (
        <Alert severity="error" style={{ marginTop: 20 }}>
          {msg}
        </Alert>
      )}

      <h2>Configuração do Chat</h2>
      <Grid container spacing={1}>

        <Grid item xs={12} sm={4}>
          <TextField
            value={oauth}
            variant="outlined"
            label="Código"
            onChange={({ target: { value } }) => setOauth(value)}
            type="password"
            placeholder="oauth:abcdefghi123456789"
            fullWidth
            required
            name="oauth"
            error={validOauth}
            helperText={validOauth ? "Código inválido" : ""}
          />
        </Grid>
        
        <Grid item xs={9} sm={2}>
          <a href={TWITCH_AUTH_URL}>
            <Button
              variant="contained"
              color="primary"
              style={{ height: 56 }}>
              Gerar código
            </Button>
          </a>
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            value={channel}
            variant="outlined"
            label="Nome do canal que o bot vai interagir"
            placeholder="unManiac"
            helperText="Lembrando que o nome é a palavra que fica após https://twitch.tv/<aqui>"
            name="channel"
            required
            onChange={({ target: { value } }) =>
              setChannel(value.replace("@", ""))
            }
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={enableAnnounce}
                disabled
                onChange={({ target: { checked } }) =>
                  setEnableAnnounce(checked)
                }
                color="primary"
                name="enableAnnounce"
              />
            }
            label="Habilitar /announce nas mensagens do Sprint (Desabilitado por não funcionar corretamente no celular)"
          />
        </Grid>

        <h2>Configuração do StreamElements</h2>
        <Grid item xs={12}>
          <p className={classes.step}>
            1. Acesse{" "}
            <a
              href="https://streamelements.com/dashboard/account/channels"
              rel="noreferrer"
              target="_blank" 
            >
              https://streamelements.com/dashboard/account/channels
            </a>
          </p>
        </Grid>

        <Grid item xs={12}>
          <p className={classes.step}>
            2. Clique em "Show secrets" no canto superior direito
          </p>
        </Grid>

        <Grid item xs={12} style={{ marginBottom: 20 }}>
          <p className={classes.step}>
            3. Terá exibido uma seção com um valor chamado "JWT Token", copie e
            cole no campo "Token" abaixo, deve começar com ey...
          </p>
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            value={token}
            variant="outlined"
            label="Token"
            name="token"
            placeholder="eyJhbGciOiJIUzI..."
            required
            type="password"
            onChange={({ target: { value } }) => {
              setChannelId(null);
              setToken(value);
            }}
            fullWidth
            error={validToken}
            helperText={validToken ? "Token inválido" : ""}
          />
        </Grid>

        <Grid item xs={9} sm={2}>
          <TextField
            value={loyalty}
            variant="outlined"
            label="Nome dos pontos"
            disabled
            name="loyalty"
            fullWidth
          />
        </Grid>

        <Grid item xs={9} sm={2}>
          <Button
            variant="contained"
            color="primary"
            style={{ height: 56 }}
            onClick={() => {
              fetchLoyalty(channelId, token);
            }}
            fullWidth
          >
            Atualizar nome
          </Button>
        </Grid>

        <h2>Configuração do Forest (opcional)</h2>

        <Grid item xs={12}></Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            value={forestEmail}
            variant="outlined"
            label="E-mail"
            name="forestEmail"
            placeholder="user@gmail.com"
            onChange={({ target: { value } }) => setForestEmail(value)}
            fullWidth
            error={forestError}
            helperText={
              forestError
                ? "Email ou senha incorretos"
                : forestToken
                ? "Token gerado com sucesso."
                : ""
            }
          />
        </Grid>

        <Grid item xs={9} sm={5}>
          <TextField
            value={forestPassword}
            variant="outlined"
            label="Senha"
            name="forestPassword"
            placeholder="**********"
            type="password"
            onBlur={() => forestLogin()}
            onChange={({ target: { value } }) => setForestPassword(value)}
            fullWidth
            error={forestError}
          />
        </Grid>

        <Grid item xs={9} sm={2}>
          <Button
            variant="contained"
            color="primary"
            style={{ height: 56, background: forestToken ? GREEN : undefined }}
            onClick={() => {
              forestLogin();
            }}
            fullWidth
          >
            {forestLoading ? "Gerando..." : "Gerar token"}
          </Button>
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            value={discordWebhook}
            variant="outlined"
            label="Discord webhook URL (avisar salas criadas)"
            name="discordWebhook"
            placeholder="**********"
            type="password"
            onChange={({ target: { value } }) => setDiscordWebhook(value)}
            fullWidth
            helperText="https://csaller.medium.com/usando-webhooks-do-discord-para-automatizar-posts-d57eb505791a"
            error={forestError}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            type="submit"
            disabled={forestLoading}
            className={classes.save}
          >
            Salvar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withRouter(Config);
