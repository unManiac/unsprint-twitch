import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import { styled } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { CONFIGURATION_UPDATE } from "../../constants/actionTypes";
import { GREEN, WHITE } from "../../constants/colors";
import { TWITCH_AUTH_URL } from "../../constants/oauth";
import { forestFetch } from "../../utils/proxy";
import { segmentTrack } from "../../utils/segment";

const StepText = styled("p")(({ theme }) => ({
  fontSize: 18,
  fontWeight: "bold",
  margin: "0",
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: GREEN,
  color: WHITE,
  marginTop: 30,
  fontSize: 18,
  "&:hover,&:active,&:focus": {
    backgroundColor: lighten(GREEN, 0.3),
  },
}));

function Config({}) {
  const location = useLocation();

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

  const [forestError, setForestError] = useState(false);
  const [forestLoading, setForestLoading] = useState(false);

  const validOauth = !!oauth && !oauth.startsWith("oauth:");
  const validToken = !!token && !token.startsWith("ey");

  useEffect(() => {
    if (msg) {
      toast.error(msg, { id: "error-msg", duration: 5000 });
    }
  }, [msg]);

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
        if (!channel.loyalty.name) {
          throw new Error("Loyalty not found");
        }

        setLoyalty(channel.loyalty.name);
      })
      .catch(() => {
        toast.error("Não encontrado, informe token corretamente.");
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
        toast.success("Token do Forest gerado com sucesso!");
      })
      .catch(() => {
        setForestError(true);
        setForestToken("");
        toast.error("Email ou senha do Forest incorretos");
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
      toast.success("Configurações salvas com sucesso.");
    }, 500);
  };
  return (
    <form onSubmit={onSave}>
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
            <Button variant="contained" size="small" color="secondary">
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
        <Grid item xs={12} /> <h2>Configuração do StreamElements</h2>
        <Grid item xs={12}>
          <StepText>
            1. Acesse{" "}
            <a
              href="https://streamelements.com/dashboard/account/channels"
              rel="noreferrer"
              target="_blank"
            >
              https://streamelements.com/dashboard/account/channels
            </a>
          </StepText>
        </Grid>
        <Grid item xs={12}>
          <StepText>
            2. Clique em "Show secrets" no canto superior direito
          </StepText>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: 20 }}>
          <StepText>
            3. Terá exibido uma seção com um valor chamado "JWT Token", copie e
            cole no campo "Token" abaixo, deve começar com ey...
          </StepText>
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
            size="small"
            color="secondary"
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
          {" "}
          <TextField
            value={forestEmail}
            variant="outlined"
            label="E-mail"
            name="forestEmail"
            placeholder="user@gmail.com"
            onChange={({ target: { value } }) => setForestEmail(value)}
            fullWidth
            error={forestError}
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
            size="small"
            color="secondary"
            style={{ background: forestToken ? GREEN : undefined }}
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
        </Grid>{" "}
        <Grid item xs={12}>
          <SaveButton
            type="submit"
            variant="contained"
            disabled={forestLoading}
          >
            Salvar
          </SaveButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default Config;
