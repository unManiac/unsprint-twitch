import { Button, Grid, TextField } from "@material-ui/core";
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMessageStarted(sprint.messageStarted);
    setMessageEnded(sprint.messageEnded);
    setMessageBonus(sprint.messageBonus);

    // update old command
    if (sprint.messageStarted?.includes("!sprint")) {
      const newSprint = { ...sprint };
      delete newSprint.messageStarted;

      dispatch({
        type: SPRINT_UPDATE,
        sprint: newSprint,
      });
    }
  }, [sprint, dispatch]);

  const onSave = (e) => {
    e.preventDefault();

    const obj = {
      multiplier,
      lives,
      minutes,
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
          style={{ display: "flex" }}
          justifyContent="space-between"
        >
          <Button variant="contained" color="primary" type="submit">
            Salvar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default SprintConfig;
