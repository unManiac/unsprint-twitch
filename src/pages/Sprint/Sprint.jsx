import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  TableCell,
  Grid,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BatchListener from "../../components/BatchListener";
import { GREEN, WHITE } from "../../constants/colors";
import useTmi from "../../useTmi";
import SprintConfig from "./SprintConfig";
import SprintRanking from "./SprintRanking";
import SprintTimer from "./SprintTimer";

const GreenTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: GREEN,
    color: WHITE,
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const RootContainer = styled(Grid)(({ theme }) => ({
  marginTop: 20,
}));

const TotalText = styled("p")(({ theme }) => ({
  textAlign: "center",
  fontWeight: 500,
  color: GREEN,
  marginTop: 0,
  marginBottom: 5,
}));

function Sprint() {
  const navigate = useNavigate();

  const [openConfig, setOpenConfig] = useState(false);
  const [overlaySprint, setOverlaySprint] = useState(
    localStorage.getItem("overlay_sprint") === "true"
  );
  const [twitch, failed] = useTmi({
    enableSprint: !overlaySprint,
    enableForest: false,
  });

  const participants = useSelector((state) => state.participant.list);
  const sprint = useSelector((state) => state.sprint);

  useEffect(() => {
    if (failed) {
      navigate("/config");
    }
  }, [failed]);

  return (
    <RootContainer container alignItems="center">
      <BatchListener />

      <Grid container justifyContent="space-between" alignItems="center">
        <h2 style={{ display: "inline-block" }}>Preparando o unSprint</h2>

        <Box>
          <Button
            onClick={() => setOpenConfig(true)}
            color="inherit"
            variant="outlined"
            style={{ marginRight: 20 }}
            href="https://www.youtube.com/watch?v=aHp66UUH7Vo"
            target="_blank"
          >
            Precisa de ajuda?
          </Button>

          <Button
            onClick={() => setOpenConfig(true)}
            color="primary"
            variant="outlined"
          >
            Editar configurações
          </Button>
        </Box>
      </Grid>

      {openConfig && (
        <SprintConfig
          open
          onToggleOverlay={setOverlaySprint}
          onClose={() => setOpenConfig(false)}
        />
      )}

      <SprintTimer sx={{ marginBottom: 3 }} twitch={twitch} />

      <Grid
        item
        xs={12}
        style={{ alignSelf: "baseline" }}
        sm={sprint.ranking ? 5 : 12}
      >
        <TotalText>Total participantes: {participants.length}</TotalText>

        <TableContainer component={Paper}>
          <Table aria-label="customized table">
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
    </RootContainer>
  );
}

export default Sprint;
