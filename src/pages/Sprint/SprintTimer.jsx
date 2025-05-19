import { Button, Grid, Tooltip } from "@mui/material";
import { lighten } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Alert } from "@mui/lab";
import Countdown from "react-countdown";
import { connect, useSelector } from "react-redux";
import { GREEN, WHITE } from "../../constants/colors";
import { startTime, changeTime, end, cancel } from "../../actions/sprint";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: GREEN,
  color: WHITE,
  "&:hover,&:active,&:focus": {
    backgroundColor: lighten(GREEN, 0.3),
  },
}));

const StepText = styled("p")(({ theme }) => ({
  fontSize: 18,
  fontWeight: "bold",
  margin: "0",
}));

function SprintTimer({ twitch, startTime, changeTime, end, cancel, ...rest }) {
  const sprint = useSelector((state) => state.sprint);

  return (
    <Grid container spacing={3} {...rest}>
      <Grid item xs={12} style={{ display: "flex" }}>
        {!sprint.ends && (
          <StyledButton
            variant="contained"
            color="primary"
            size="large"
            onClick={() => startTime(twitch)}
          >
            Iniciar Sprint de {sprint.minutes} minutos
          </StyledButton>
        )}
        {sprint.finished && (
          <Alert style={{ flex: 1, marginLeft: 10 }} severity="info">
            Sprint finalizado!
          </Alert>
        )}
        {sprint.ends && (
          <div>
            <Tooltip title="Após modificar o tempo, os participantes terão seus pontos recalculados com base no novo tempo.">
              <span>
                <Button
                  variant="outlined"
                  style={{ marginRight: 10 }}
                  color="primary"
                  onClick={() => changeTime(twitch)}
                >
                  Modificar tempo
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Os participantes vão pode resgatar seus pontos e de acordo com o tempo prometido de sprint.">
              <span>
                <Button
                  variant="outlined"
                  style={{ marginRight: 10 }}
                  color="error"
                  onClick={() =>
                    window.confirm("Deseja realmente encerrar?") && end(twitch)
                  }
                >
                  Encerrar antes
                </Button>
              </span>
            </Tooltip>

            <Button
              variant="outlined"
              style={{ marginRight: 10 }}
              color="secondary"
              onClick={() => {
                if (window.confirm("Deseja realmente cancelar?")) {
                  cancel();
                }
              }}
            >
              Cancelar sprint
            </Button>

            <Countdown
              date={sprint.ends}
              controlled={false}
              onComplete={() => end(twitch)}
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default connect(undefined, {
  startTime,
  changeTime,
  end,
  cancel,
})(SprintTimer);
