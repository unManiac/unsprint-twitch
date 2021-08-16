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
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { GREEN, WHITE } from "../../constants/colors";
import useTmi from "../../useTmi";
import SprintConfig from "./SprintConfig";
import SprintTimer from "./SprintTimer";

const StyledTableCell = withStyles(() => ({
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
    marginTop: 30,
  },
  config: {
    marginTop: 30,
    marginBottom: 30,
  },
  timer: {
    marginBottom: 30,
  },
  total: {
    textAlign: "right",
    fontWeight: 500,
    color: GREEN,
    marginTop: 0,
    marginBottom: 5,
  },
}));

function Sprint({ history }) {
  const classes = useStyles();
  const [twitch] = useTmi();

  const failed = false;

  const participants = useSelector((state) => state.participant.list);

  if (failed) {
    history.push(`/config`);
  }

  return (
    <Grid container className={classes.root} alignItems="center">
      <Grid item xs={12} sm={12}>
        <h2 style={{ margin: 0 }}>Preparando o unSprint</h2>
      </Grid>

      <SprintConfig className={classes.config} />

      <SprintTimer className={classes.timer} twitch={twitch} />

      <Grid item xs={12} sm={12}>
        <p className={classes.total}>
          Total participantes: {participants.length}
        </p>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Usuário</StyledTableCell>
                <StyledTableCell align="right">Minutos</StyledTableCell>
                <StyledTableCell align="right">Vidas</StyledTableCell>
                <StyledTableCell align="right">Pontos</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((p) => (
                <StyledTableRow key={p.username}>
                  <StyledTableCell component="th" scope="row">
                    {p.username}
                  </StyledTableCell>
                  <StyledTableCell align="right">{p.minutes}</StyledTableCell>
                  <StyledTableCell align="right">{p.lives}</StyledTableCell>
                  <StyledTableCell align="right">{p.points}</StyledTableCell>
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
