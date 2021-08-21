import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { BLUE, GREEN, WHITE } from "../../constants/colors";
import useTmi from "../../useTmi";
import SprintConfig from "./SprintConfig";
import SprintTimer from "./SprintTimer";

const GreenTableCell = withStyles(() => ({
  head: {
    backgroundColor: GREEN,
    color: WHITE,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const BlueTableCell = withStyles(() => ({
  head: {
    backgroundColor: BLUE,
    color: WHITE,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
  },
  timer: {
    marginBottom: 30,
  },
  total: {
    textAlign: "center",
    fontWeight: 500,
    color: GREEN,
    marginTop: 0,
    marginBottom: 5,
  },
}));

function Sprint({ history }) {
  const classes = useStyles();
  const [twitch, failed] = useTmi();

  const [openConfig, setOpenConfig] = useState(false);
  const [alert, setAlert] = useState();

  const participants = useSelector((state) => state.participant.list);

  if (failed) {
    history.push(`/config`);
  }

  const updateAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => setAlert(null), 2500);
  };

  return (
    <Grid container className={classes.root} alignItems="center">
      {alert && (
        <Alert severity={alert.severiy} style={{ flex: 1, marginBottom: 10 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container justifyContent="space-between" alignItems="center">
        <h2 style={{ display: "inline-block" }}>Preparando o unSprint</h2>

        <Button
          onClick={() => setOpenConfig(true)}
          color="primary"
          variant="outlined"
        >
          Editar configurações
        </Button>
      </Grid>

      <SprintConfig
        open={openConfig}
        updateAlert={updateAlert}
        onClose={() => setOpenConfig(false)}
      />

      <SprintTimer
        updateAlert={updateAlert}
        className={classes.timer}
        twitch={twitch}
      />

      <Grid item xs={12} sm={12}>
        <p className={classes.total}>
          Total participantes: {participants.length}
        </p>

        <TableContainer component={Paper}>
          <Table className={classes.participants} aria-label="customized table">
            <TableHead>
              <TableRow>
                <GreenTableCell>Usuário</GreenTableCell>
                <GreenTableCell align="right">Vidas</GreenTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((p) => (
                <StyledTableRow key={p.username}>
                  <GreenTableCell component="th" scope="row">
                    {p.username}
                  </GreenTableCell>
                  <GreenTableCell align="right">{p.lives}</GreenTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default withRouter(Sprint);
