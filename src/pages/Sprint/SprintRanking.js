import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableBody,
  TableCell,
  withStyles,
  Grid,
  TextField,
  TablePagination,
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RANKING_PARTICIPANT_UPDATE,
  RANKING_RESET,
} from "../../constants/actionTypes";
import { BLUE, GREEN, WHITE } from "../../constants/colors";
import { getLastMonday } from "../../helper";

const useStyles1 = makeStyles(() => ({
  root: {
    flexShrink: 0,
    marginLeft: 30,
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

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
  total: {
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    fontWeight: 500,
    color: GREEN,
    marginTop: 0,
    marginBottom: 5,
  },
}));

function SprintRanking() {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [rankingWillReset, setRankingWillReset] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const dispatch = useDispatch();

  const ranking = useSelector((state) =>
    state.ranking.list.map((p, idx) => ({ ...p, position: idx + 1 }))
  );
  const rankingLastReset = useSelector((state) => state.ranking.lastReset);
  const sprint = useSelector((state) => state.sprint);

  useEffect(() => {
    if (!rankingLastReset) {
      dispatch({ type: RANKING_RESET });
    }
    setRankingWillReset(
      !sprint.disableResetRanking && rankingLastReset < getLastMonday()
    );
  }, [rankingLastReset, sprint, dispatch]);

  const filteredRanking = ranking.filter(
    (p) => !search || p.username.includes(search)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSeach = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const editMinutes = (p) => {
    const minutes = prompt(`Alterar os minutos de ${p.username}`, p.minutes);

    if (minutes) {
      dispatch({
        type: RANKING_PARTICIPANT_UPDATE,
        participant: {
          ...p,
          minutes,
        },
      });
    }
  };

  return (
    <>
      <Grid item xs={12} sm={1}></Grid>

      <Grid item xs={12} sm={6} style={{ alignSelf: "baseline" }}>
        {rankingWillReset && (
          <Alert severity="warning">
            O ranking será resetado e os prêmios distribuídos assim que você
            iniciar um novo sprint.
          </Alert>
        )}
        {sprint.disableResetRanking && (
          <Alert severity="error">Ranking não será resetado.</Alert>
        )}

        <p className={classes.total} style={{ color: BLUE }}>
          <div>Ranking semanal: {ranking.length}</div>
          <TextField
            value={search}
            placeholder="Filtrar nome"
            onChange={handleSeach}
          />
        </p>

        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <BlueTableCell>#</BlueTableCell>
                <BlueTableCell>Usuário</BlueTableCell>
                <BlueTableCell align="right">Minutos</BlueTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRanking
                .slice(rowsPerPage * page, rowsPerPage * (page + 1))
                .map((p, idx) => (
                  <StyledTableRow key={p.username}>
                    <BlueTableCell component="th" scope="row">
                      {p.position}°
                    </BlueTableCell>
                    <BlueTableCell component="th" scope="row">
                      {p.username}
                    </BlueTableCell>
                    <BlueTableCell align="right">
                      <span onClick={() => editMinutes(p)}>{p.minutes}</span>
                    </BlueTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredRanking.length}
          page={page}
          labelRowsPerPage="Quantidade por página"
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          ActionsComponent={TablePaginationActions}
        />
      </Grid>
    </>
  );
}

export default SprintRanking;
