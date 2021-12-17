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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { SPRINT_UPDATE } from "../../constants/actionTypes";
import { GREEN, WHITE } from "../../constants/colors";
import { initialState } from "../../reducers/sprint";
import useTmi from "../../useTmi";
import SprintConfig from "./SprintConfig";
import SprintRanking from "./SprintRanking";
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

  const dispatch = useDispatch();

  const participants = useSelector((state) => state.participant.list);
  const sprint = useSelector((state) => state.sprint);

  if (failed) {
    history.push(`/config`);
  }

  useEffect(() => {
    // update new configuration
    let update = false;

    if (sprint.messageAnxious === undefined) {
      sprint.messageFinished = initialState.messageFinished;
      sprint.messageAlreadyConfirmed = initialState.messageAlreadyConfirmed;
      sprint.messageAnxious = initialState.messageAnxious;
      sprint.messageLate = initialState.messageLate;
      sprint.messageTime = initialState.messageTime;
    }

    if (update) {
      dispatch({
        type: SPRINT_UPDATE,
        sprint,
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [sprint, dispatch]);

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

      {openConfig && (
        <SprintConfig
          open
          updateAlert={updateAlert}
          onClose={() => setOpenConfig(false)}
        />
      )}

      <SprintTimer
        updateAlert={updateAlert}
        className={classes.timer}
        twitch={twitch}
      />

      <Grid
        item
        xs={12}
        style={{ alignSelf: "baseline" }}
        sm={sprint.ranking ? 5 : 12}
      >
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

      {sprint.ranking && <SprintRanking />}
    </Grid>
  );
}

export default withRouter(Sprint);
