import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SPRINT_UPDATE } from "../../constants/actionTypes";

function SprintConfig({ ...rest }) {
  const dispatch = useDispatch();
  const sprint = useSelector((state) => state.sprint);

  const [messageStarted, setMessageStarted] = useState(sprint.messageStarted);
  const [messageEnded, setMessageEnded] = useState(sprint.messageEnded);
  const [messageBonus, setMessageBonus] = useState(sprint.messageBonus);
  const [multiplier, setMultiplier] = useState(sprint.multiplier);
  const [lives, setLives] = useState(sprint.lives);
  const [minutes, setMinutes] = useState(sprint.minutes);
  const [warnMissingLives, setWarnMissingLives] = useState(
    sprint.warnMissingLives
  );
  const [modImmune, setModImmune] = useState(sprint.modImmune);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMessageStarted(sprint.messageStarted);
    setMessageEnded(sprint.messageEnded);
    setMessageBonus(sprint.messageBonus);

    // update new configuration
    if (sprint.warnMissingLives === undefined) {
      const newSprint = { ...sprint, warnMissingLives: true, modImmune: false };
      dispatch({
        type: SPRINT_UPDATE,
        sprint: newSprint,
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [sprint, dispatch]);

  const onSave = (e) => {
    e.preventDefault();

    const obj = {
      multiplier,
      lives,
      minutes,
      warnMissingLives,
      modImmune,
    };

    if (messageStarted) {
      obj.messageStarted = messageStarted;
    }

    if (messageEnded) {
      obj.messageEnded = messageEnded;
    }

    if (messageBonus) {
      obj.messageBonus = messageBonus;
    }

    setSuccess(false);
    dispatch({
      type: SPRINT_UPDATE,
      sprint: obj,
    });

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 500);
  };

  return (
    <form onSubmit={onSave} {...rest}>
      {success && (
        <Alert severity="success" style={{ marginBottom: 40 }}>
          Sprint salvo com sucesso.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <TextField
            value={minutes}
            variant="outlined"
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
            variant="outlined"
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
            variant="outlined"
            label="Multiplicador de pontos"
            name="multiplier"
            type="number"
            required
            onChange={({ target: { value } }) => setMultiplier(value)}
            fullWidth
            helperText={`1 minuto = ${multiplier} pontos`}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            value={messageStarted}
            variant="outlined"
            label="Mensagem de início do unSprint"
            name="message"
            onChange={({ target: { value } }) => setMessageStarted(value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            value={messageEnded}
            variant="outlined"
            label="Mensagem de finalização do unSprint"
            name="message"
            onChange={({ target: { value } }) => setMessageEnded(value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            value={messageBonus}
            variant="outlined"
            label="Mensagem de vidas extras no unSprint"
            name="message"
            onChange={({ target: { value } }) => setMessageBonus(value)}
            fullWidth
            helperText="Digite !vida <numero> para dar mais vidas aos participantes, útil pra agradecer raid."
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={3}
          style={{ paddingTop: 0, paddingBottom: 0, marginLeft: "auto" }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={modImmune}
                onChange={({ target: { checked } }) => setModImmune(checked)}
                color="primary"
                name="modImmune"
              />
            }
            label="Moderadores não perdem vida."
          />
        </Grid>

        <Grid item xs={12} sm={5} style={{ paddingTop: 0, paddingBottom: 0 }}>
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

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Salvar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default SprintConfig;
