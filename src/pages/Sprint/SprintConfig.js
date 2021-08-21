import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SPRINT_UPDATE } from "../../constants/actionTypes";
import { WHITE } from "../../constants/colors";
import { oldState } from "../../reducers/sprint";

const useStyles = makeStyles(() => ({
  form: {
    padding: 10,
  },
  title: {
    marginTop: 0,
  },
  dialog: {
    overflow: "hidden",
    paddingBottom: 40,
  },
  actions: {
    justifyContent: "center",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    paddingTop: 20,
    position: "sticky",
    bottom: 0,
    background: WHITE,
  },
}));

function SprintConfig({ open, updateAlert, onClose, ...rest }) {
  const classes = useStyles();

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

  useEffect(() => {
    setMessageStarted(sprint.messageStarted);
    setMessageEnded(sprint.messageEnded);
    setMessageBonus(sprint.messageBonus);

    // update new configuration
    let update = false;
    if (oldState.messageStarted === sprint.messageStarted) {
      update = true;
      delete sprint.messageStarted;
    }
    if (oldState.messageEnded === sprint.messageEnded) {
      update = true;
      delete sprint.messageEnded;
    }
    if (oldState.messageConfirmation === sprint.messageConfirmation) {
      update = true;
      delete sprint.messageConfirmation;
    }

    if (update) {
      dispatch({
        type: SPRINT_UPDATE,
        sprint: sprint,
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

    dispatch({
      type: SPRINT_UPDATE,
      sprint: obj,
    });
    updateAlert({
      severiy: "success",
      message: "Configurações salvas com sucesso.",
    });
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="lg">
      <form onSubmit={onSave} className={classes.form} {...rest}>
        <DialogContent className={classes.dialog}>
          <h2 className={classes.title}>Configurações do Sprint</h2>

          <Grid container spacing={3}>
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
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={messageStarted}
                label="Mensagem de início do unSprint"
                name="message"
                onChange={({ target: { value } }) => setMessageStarted(value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={messageEnded}
                label="Mensagem de finalização do unSprint"
                name="message"
                onChange={({ target: { value } }) => setMessageEnded(value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={messageBonus}
                label="Mensagem de vidas extras no unSprint"
                name="message"
                onChange={({ target: { value } }) => setMessageBonus(value)}
                fullWidth
                helperText="Digite !vida <numero> para dar mais vidas aos participantes, útil pra agradecer raid."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className={classes.actions}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            style={{ marginRight: 30, width: 150 }}
          >
            Salvar
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default SprintConfig;
