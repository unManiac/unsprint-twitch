import { Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { GREEN, WHITE } from "../../constants/colors";
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

const BetaTag = styled('sup')(({ theme }) => ({
  background: "red",
  color: WHITE,
  borderRadius: 25,
  padding: "1px 5px",
  fontSize: 10,
}));

function Forest({}) {
  const navigate = useNavigate();

  const config = useSelector((state) => state.configuration);

  useEffect(() => {
    if (!config.forestToken) {
      toast.error(
        "Preencha corretamente os primeiros e últimos campos da tela para utilizar a função do Forest."
      );
      navigate(`/config`);
    }
  }, [config]);

  const urlOverlay = `${window.location.href.replace(
    "forest",
    ""
  )}overlay/forest?hide=********************************************************************************************************&config=${b64EncodeUnicode(
    JSON.stringify({ config })
  )}`;

  return (
    <StyledGrid container spacing={1} alignItems="center">
      <Title>
        Forest (Aplicativo de Foco)
        <BetaTag>Beta</BetaTag>
      </Title>

      <Grid item xs={12}>
        <StepText style={{ fontWeight: "500", color: "red" }}>
          Aviso: Essa integração não é fornecida diretamente pelo Forest, foi
          analisado o funcionamento do aplicativo e replicado pra uso no Bot,
          qualquer violação dos termos de uso do Forest é da responsabilidade do
          próprio usuário.{" "}
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <h3>Funcionamento:</h3>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          1. Clicando no link abaixo ele será copiado automaticamente, adicione
          no OBS como navegador e para personalizações utilize as propriedades
          da fonte chamada "CSS customizado".{" "}
          <strong>
            Não é necessário manter o site aberto pro funcionamento do Forest,
            pórém o overlay deve estar visível em todas cenas pra responder aos
            comandos.
          </strong>
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

      <Grid item xs={12}>
        Exemplo de CSS com a cor branca e tamanho de letra 64px:{" "}
        <pre>{`body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; color: white; font-size: 64px }`}</pre>
      </Grid>

      <Grid item xs={12}>
        <p style={{ color: GREEN }}>
          Se foi exibido <b>"Pronto"</b> no overlay, ele está configurado
          corretamente e basta seguir os próximos passos.
        </p>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          2. Para criar uma sala digite <b>!unforest sala</b> no chat que foi
          configurado o bot, após digitado esse comando o bot irá mandar 3x o
          link da sala no chat e se alguém precisar que envie novamente o link
          basta digitar <b>!unforest</b> sem nada além. O código da sala será
          exibido visualmente no overlay.
        </StepText>
        <p style={{ color: "#3D76EF" }}>
          É possível utilizar apenas <b>!uf ...</b> como alias dos comandos{" "}
          <b>!unforest ...</b>
        </p>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          3. Importante, mesmo usando sua conta, as salas criadas <b>NÃO</b> são
          exibidas diretamente no seu aplicativo, se você quiser visualizar a
          sala será necessário entrar nela utilizando o código fornecido. A sala
          pode ser iniciada mesmo que não esteja visível no seu aplicativo.
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          4. Por padrão toda sala é criada com a árvore inicial e com duração de
          60 minutos, mas isso pode ser alterado a qualquer momento antes de
          iniciar a sala. Para exibir a lista de árvores que você possui digite{" "}
          <b>!unforest arvores</b>, é listado o código e nome em português de
          cada árvore e para mudar a árvore da sala digite{" "}
          <b>!unforest arvore nome</b> ou <b>!unforest arvore codigo</b>. Por
          exemplo: <b>!unforest arvore coral estrelado</b> ou{" "}
          <b>!unforest arvore 6</b>
          <br />
          Para utilizar uma árvore aleatória, digite <b>!unforest arvore ?</b>
          <br />
          <br />
          Acentos são desconsiderados, e se caso o nome exato não for
          encontrado, é realizado uma busca por partes do texto, por exemplo se
          digitar <b>!unforest arvore natal</b> e você possuir a "Árvore de
          Natal", ela será escolhida.
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          5. Para alterar o tempo da sala, digite <b>!unforest tempo XX</b>,
          onde XX significa os minutos. Por exemplo: <b>!unforest tempo 120</b>
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          6. Todas alterações de tempo e árvore são gravadas no
          navegador/overlay e novas salas criadas vão reutilizar os parâmetros
          anteriores.
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          7. Para iniciar a sala digite <b>!unforest iniciar</b>. Todos os
          comandos listados aqui são ativados apenas se digitado pelo streamer
          ou moderadores do canal.
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          8. Para remover a informação da última sala na tela, digite{" "}
          <b>!unforest remover</b>
        </StepText>
      </Grid>

      <Grid item xs={12}>
        <StepText>
          9. Se tiver mensagens duplicadas no chat pelo Bot, digite{" "}
          <b>!unforest atualiza</b>
        </StepText>
      </Grid>
    </StyledGrid>
  );
}

export default Forest;
