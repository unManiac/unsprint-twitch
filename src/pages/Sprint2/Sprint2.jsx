import { Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, } from "react-router-dom";
import { GREEN, } from "../../constants/colors";
import { b64EncodeUnicode } from "../../helper";
import { toast } from "sonner";

const StyledGrid = styled(Grid)(({ theme }) => ({
  marginTop: 20,
}));

const StepText = styled('p')(({ theme }) => ({
  fontSize: 18,
  margin: "10px 0",
}));

const Title = styled('h2')(({ theme }) => ({
  color: GREEN,
}));


function Sprint2({ }) {
  const navigate = useNavigate();

  const sprint = useSelector((state) => state.sprint);
  const config = useSelector((state) => state.configuration);
  const vip = useSelector((state) => state.vip);

  useEffect(() => {
    if (!config.oauth) {
      toast.error(
        "Preencha corretamente o token de Sprint."
      );
      navigate(`/config`);
    }
  }, [config]);

  const urlOverlay = `${window.location.href
    }overlay/sprint?hide=********************************************************************************************************&scroll=20&nomsg=${window.encodeURI(
      ": sem ranking"
    )}&msg=${window.encodeURI(
      ": @minutos minutos (@posicao°)"
    )}&config=${b64EncodeUnicode(JSON.stringify({ sprint, config, vip }))}`;

  return (
    <StyledGrid container spacing={1} alignItems="center">
      <Title>
        Sprint (Bot overlay OBS)
      </Title>

      <Grid item xs={12}>
        <StepText style={{ fontWeight: "500", color: "red" }}>
          Aviso: Essa integração não é recomendada, apenas utilize se tiver conhecimento.{" "}
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <TextField
          value={urlOverlay}
          onClick={() => {
            navigator.clipboard.writeText(urlOverlay);
          }}
          error
          helperText="Não compartilhe esse link com ninguém!"
          disabled
          fullWidth
        />
      </Grid>
    </StyledGrid>
  );
}

export default Sprint2;
