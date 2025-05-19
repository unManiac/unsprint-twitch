import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RANKING_RESET, SPRINT_UPDATE } from "../../constants/actionTypes";
import { WHITE } from "../../constants/colors";
import { getNextMonday } from "../../helper";
import { initialState } from "../../reducers/sprint";
import SprintVip from "./SprintVip";
import { toast } from "sonner";

const StyledForm = styled("form")(({ theme }) => ({
  padding: 10,
}));

const Title = styled("h2")(({ theme }) => ({
  marginTop: 0,
}));

const DialogContentStyled = styled(DialogContent)(({ theme }) => ({
  overflow: "hidden",
  paddingBottom: 40,
}));

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  justifyContent: "center",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  paddingTop: 20,
  position: "sticky",
  bottom: 0,
  background: WHITE,
}));

const BetaTag = styled("sup")(({ theme }) => ({
  background: "red",
  color: WHITE,
  borderRadius: 25,
  padding: "1px 5px",
  fontSize: 10,
}));

function SprintConfig({ open, onToggleOverlay, onClose, ...rest }) {
  const dispatch = useDispatch();
  const sprint = useSelector((state) => state.sprint);
  const config = useSelector((state) => state.configuration);

  const [messageStarted, setMessageStarted] = useState(sprint.messageStarted);
  const [messageEnded, setMessageEnded] = useState(sprint.messageEnded);
  const [messageBonus, setMessageBonus] = useState(sprint.messageBonus);
  const [messageConfirmation, setMessageConfirmation] = useState(
    sprint.messageConfirmation
  );
  const [messageAlreadyConfirmed, setMessageAlreadyConfirmed] = useState(
    sprint.messageAlreadyConfirmed
  );
  const [messageAnxious, setMessageAnxious] = useState(sprint.messageAnxious);
  const [messageLate, setMessageLate] = useState(sprint.messageLate);
  const [messageFinished, setMessageFinished] = useState(
    sprint.messageFinished
  );
  const [multiplier, setMultiplier] = useState(sprint.multiplier);
  const [multiplierSub, setMultiplierSub] = useState(sprint.multiplierSub);
  const [multiplierVip, setMultiplierVip] = useState(sprint.multiplierVip);
  const [lives, setLives] = useState(sprint.lives);
  const [minutes, setMinutes] = useState(sprint.minutes);
  const [warnMissingLives, setWarnMissingLives] = useState(
    sprint.warnMissingLives
  );
  const [implicitReedemSilent, setImplicitReedemSilent] = useState(
    sprint.implicitReedemSilent || false
  );
  const [modImmune, setModImmune] = useState(sprint.modImmune);
  const [ranking, setRanking] = useState(sprint.ranking);
  const [rankingPrize1, setRankingPrize1] = useState(sprint.rankingPrize1);
  const [rankingPrize2, setRankingPrize2] = useState(sprint.rankingPrize2);
  const [rankingPrize3, setRankingPrize3] = useState(sprint.rankingPrize3);
  const [modCanControlBot, setModCanControlBot] = useState(
    sprint.modCanControlBot || false
  );

  const [openSpecialMultiplier, setOpenSpecialMultiplier] = useState(false);

  const onSave = (e) => {
    e.preventDefault();

    const obj = {
      multiplier,
      lives,
      minutes,
      warnMissingLives,
      modImmune,
      messageStarted,
      messageEnded,
      messageBonus,
      messageConfirmation,
      messageFinished,
      messageAlreadyConfirmed,
      messageAnxious,
      messageLate,
      multiplierSub,
      multiplierVip,
      ranking,
      rankingPrize1,
      rankingPrize2,
      rankingPrize3,
      implicitReedemSilent,
      modCanControlBot,

      // preserve original values
      allImmune: sprint.allImmune,
      disableResetRanking: sprint.disableResetRanking,
    };

    if (sprint.ranking && !ranking) {
      if (
        window.confirm(
          "O ranking será desativado e portanto todos participantes serão eliminados, deseja continuar?"
        )
      ) {
        dispatch({ type: RANKING_RESET });
      } else {
        return;
      }
    }

    dispatch({
      type: SPRINT_UPDATE,
      sprint: obj,
    });
    toast.success("Configurações salvas com sucesso.");
    onClose();
  };

  const resetMessageProp = (action) => ({
    InputProps: {
      endAdornment: (
        <Tooltip title="Clicando aqui a mensagem será restaurada para a original.">
          <span>
            <IconButton onClick={action} size="small">
              🗑️
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
  });

  const urlTimer = `${window.location.href}overlay/timer?channel=${config.channel}&font=Kodchasan`;

  return (
    <>
      {openSpecialMultiplier && (
        <SprintVip open onClose={() => setOpenSpecialMultiplier(false)} />
      )}
      <Dialog open={open} maxWidth="lg">
        <StyledForm onSubmit={onSave} {...rest}>
          <DialogContentStyled>
            <Title>Configurações do Sprint</Title>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={2}>
                <TextField
                  value={minutes}
                  label="Tempo de Sprint"
                  name="minutes"
                  type="number"
                  required
                  onChange={({ target: { value } }) => setMinutes(value)}
                  fullWidth
                  helperText="em minutos"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  value={lives}
                  label="Quantidade de vidas"
                  name="lives"
                  type="number"
                  required
                  onChange={({ target: { value } }) => setLives(value)}
                  fullWidth
                  helperText="1 vida = 1 mensagem"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  value={multiplier}
                  label="Multiplicador pontos"
                  name="multiplier"
                  type="number"
                  required
                  onChange={({ target: { value } }) => setMultiplier(value)}
                  fullWidth
                  helperText={`1 minuto = ${multiplier} pontos`}
                />
              </Grid>

              <Grid
                item
                xs={6}
                style={{ paddingTop: 0, paddingBottom: 0, marginLeft: "auto" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={modImmune}
                      onChange={({ target: { checked } }) =>
                        setModImmune(checked)
                      }
                      color="primary"
                      name="modImmune"
                    />
                  }
                  label="Moderadores não perdem vida."
                />
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={modCanControlBot}
                      onChange={({ target: { checked } }) =>
                        setModCanControlBot(checked)
                      }
                      color="primary"
                      name="modCanControlBot"
                    />
                  }
                  label="Moderadores podem controlar o bot."
                />
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={warnMissingLives}
                      onChange={({ target: { checked } }) =>
                        setWarnMissingLives(checked)
                      }
                      color="primary"
                      name="warnMissingLives"
                    />
                  }
                  label="Avisar quantas vidas faltam quando digitarem no chat."
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  value={multiplierSub}
                  label="Multiplicador p/ Subs"
                  name="multiplierSub"
                  type="number"
                  onChange={({ target: { value } }) => setMultiplierSub(value)}
                  fullWidth
                  helperText={`1 minuto = ${multiplierSub || 0} pontos`}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  value={multiplierVip}
                  label="Multiplicador p/ Vips"
                  name="multiplierVip"
                  type="number"
                  onChange={({ target: { value } }) => setMultiplierVip(value)}
                  fullWidth
                  helperText={`1 minuto = ${multiplierVip || 0} pontos`}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <p style={{ color: "#777", fontSize: 14 }}>
                  A regra de uso de multiplicador é sempre pegar o <b>maior</b>,
                  portanto se o participante tiver sub e vip ao mesmo tempo,
                  será utilizado o maior multiplicador dentre esses. Essa regra
                  também inclui o multiplicador normal.
                </p>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  color="primary"
                  onClick={() => setOpenSpecialMultiplier(true)}
                >
                  Multiplicador especial
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  value={messageStarted}
                  label="Mensagem de início do unSprint"
                  name="message"
                  onChange={({ target: { value } }) => setMessageStarted(value)}
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageStarted(initialState.messageStarted)
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  value={messageEnded}
                  label="Mensagem de finalização do unSprint"
                  name="message"
                  onChange={({ target: { value } }) => setMessageEnded(value)}
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageEnded(initialState.messageEnded)
                  )}
                />
              </Grid>

              <Grid item xs={6} style={{ alignSelf: "baseline" }}>
                <TextField
                  value={messageConfirmation}
                  label="Mensagem de resposta do !iniciar"
                  name="messageConfirmation"
                  onChange={({ target: { value } }) =>
                    setMessageConfirmation(value)
                  }
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageConfirmation(initialState.messageConfirmation)
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  value={messageFinished}
                  label="Mensagem de resposta do !ganhei"
                  name="messageFinished"
                  onChange={({ target: { value } }) =>
                    setMessageFinished(value)
                  }
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageFinished(initialState.messageFinished)
                  )}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={implicitReedemSilent}
                      onChange={({ target: { checked } }) =>
                        setImplicitReedemSilent(checked)
                      }
                      color="primary"
                      name="implicitReedemSilent"
                    />
                  }
                  label="Não responder nos resgates implícitos."
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  value={messageAlreadyConfirmed}
                  label="Mensagem já confirmado"
                  name="messageAlreadyConfirmed"
                  onChange={({ target: { value } }) =>
                    setMessageAlreadyConfirmed(value)
                  }
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageAlreadyConfirmed(
                      initialState.messageAlreadyConfirmed
                    )
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  value={messageAnxious}
                  label="Mensagem ansiedade"
                  name="messageAnxious"
                  onChange={({ target: { value } }) => setMessageAnxious(value)}
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageAnxious(initialState.messageAnxious)
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  value={messageLate}
                  label="Mensagem atrasado"
                  name="messageLate"
                  onChange={({ target: { value } }) => setMessageLate(value)}
                  fullWidth
                  {...resetMessageProp(() =>
                    setMessageLate(initialState.messageLate)
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  value={messageBonus}
                  label="Mensagem de vidas extras no unSprint"
                  name="message"
                  onChange={({ target: { value } }) => setMessageBonus(value)}
                  fullWidth
                  helperText="Digite !vida <numero> para dar mais vidas aos participantes, útil pra agradecer raid."
                  {...resetMessageProp(() =>
                    setMessageBonus(initialState.messageBonus)
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider style={{ marginTop: 20, marginBottom: 10 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ranking}
                      color="primary"
                      onChange={() => {
                        setRanking((prev) => !prev);
                        if (!rankingPrize1) {
                          setRankingPrize1(1);
                        }
                        if (!rankingPrize2) {
                          setRankingPrize2(0.7);
                        }
                        if (!rankingPrize3) {
                          setRankingPrize3(0.3);
                        }
                      }}
                    />
                  }
                  label="Habilitar ranking semanal"
                />
                <p style={{ color: "#777", marginTop: 0, fontSize: 14 }}>
                  <i>!minutos</i> exibe a posição da pessoa no ranking.
                  <br />
                  <i>!unranking</i> exibe os primeiros 3 colocados.
                </p>
              </Grid>

              <Grid item xs={12} sm={8}>
                <p style={{ color: "#777", fontSize: 14 }}>
                  O ranking é baseado em <b>minutos</b>, cada vez que o
                  participante resgatar seu prêmio no final, seus minutos serão
                  somados e exibidos no ranking. O funcionamento é muito
                  parecido com o Leaderboard de sub/bits da Twitch, será
                  resetado sempre na madrugada de segunda-feira. Próxima data
                  para resetar:{" "}
                  <b>{new Date(getNextMonday()).toLocaleDateString()}</b>.
                </p>
              </Grid>

              {ranking && (
                <>
                  <Grid item xs={12} style={{ paddingBottom: 0 }}>
                    <b>Premiação dos primeiros colocados antes de resetar</b>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      value={rankingPrize1}
                      label="Multiplicador do 1°"
                      name="rankingPrize1"
                      type="number"
                      onChange={({ target: { value } }) =>
                        setRankingPrize1(value)
                      }
                      fullWidth
                      helperText={`1000 minutos = ${
                        (rankingPrize1 || 0) * 1000
                      } pontos`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      value={rankingPrize2}
                      label="Multiplicador do 2°"
                      name="rankingPrize2"
                      type="number"
                      onChange={({ target: { value } }) =>
                        setRankingPrize2(value)
                      }
                      fullWidth
                      helperText={`1000 minutos = ${
                        (rankingPrize2 || 0) * 1000
                      } pontos`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      value={rankingPrize3}
                      label="Multiplicador do 3°"
                      name="rankingPrize3"
                      type="number"
                      onChange={({ target: { value } }) =>
                        setRankingPrize3(value)
                      }
                      fullWidth
                      helperText={`1000 minutos = ${
                        (rankingPrize3 || 0) * 1000
                      } pontos`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <p style={{ color: "#777", fontSize: 14 }}>
                      A <b>premiação</b> é conforme o total de minutos que os
                      primeiros colocados conseguiram, por exemplo, se o
                      primeiro colocado somou 1200 minutos e o multiplicador
                      dele é 0,5 sua premiação será de 600 pontos.
                    </p>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider style={{ marginTop: 20, marginBottom: 10 }} />
              </Grid>

              <Grid item xs={12}>
                {" "}
                <span>
                  <strong>Overlay do Timer</strong>
                  <BetaTag>Beta</BetaTag>
                  <br />
                  Importante: apenas funciona com comandos digitados no chat.
                  Acesse a aba "Glossário" no topo para saber os comandos.
                  Clique no texto abaixo que será copiado automaticamente
                </span>
                <TextField
                  value={urlTimer}
                  onClick={() => {
                    navigator.clipboard.writeText(urlTimer);
                  }}
                  error
                  helperText="Não compartilhe esse link com ninguém!"
                  disabled
                  fullWidth
                />
                <strong>Sugestão de configuração:</strong>
                <br />
                <span>- Largura: 500</span>
                <br />
                <span>- Altura: 140</span>
                <br />
                <span>
                  - CSS personalizado:{" "}
                  <pre>{`body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; color: white; font-size: 100px; }`}</pre>
                </span>
                <br />{" "}
              </Grid>
            </Grid>
          </DialogContentStyled>
          <DialogActionsStyled>
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
              style={{ marginRight: 30, width: 150 }}
            >
              Salvar
            </Button>
            <Button variant="outlined" color="error" onClick={() => onClose()}>
              Fechar
            </Button>{" "}
          </DialogActionsStyled>
        </StyledForm>
      </Dialog>
    </>
  );
}

export default SprintConfig;
