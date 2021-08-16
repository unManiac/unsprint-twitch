import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { GREEN } from "../../constants/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "0",
    color: GREEN,
  },
  answer: {
    fontSize: 18,
    fontWeight: 500,
    margin: "0 0 20px 0",
    color: "#333",
  },
}));

export default function About() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={1} alignItems="center">
      <p className={classes.title}>1. O que é o unSprint?</p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          É uma ferramenta que permite Streamers engajar e premiar pessoas que
          querem fazer parte do sprint.{" "}
          <s style={{ fontSize: 12 }}>
            Também conhecido como Vaca Amarela v2.0, que é muito melhor que
            aquele outro bot que tem por ai, sem ofender.
          </s>
        </p>
      </Grid>

      <p className={classes.title}>2. Como faço para configurar?</p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          Clique na aba de Configuração no topo do site e siga o passo a passo.
        </p>
      </Grid>

      <p className={classes.title}>3. Como usar?</p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          O Streamer apenas precisa ir na página de Sprint localizado no menu ao
          topo, informar os detalhes do Sprint, clicar em Salvar e quando
          desejado Iniciar o Sprint. A partir desse momento será enviado uma
          mensagem no chat para que as pessoas leiam e comecem a interagir com
          essa ferramenta.
        </p>
      </Grid>

      <p className={classes.title}>4. O que são "Vidas"?</p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          A Vida permite que o participante do sprint possa enviar uma mensagem
          no chat sem perder seu ansioso prêmio, a quantidade de Vidas é
          configurável na tela de Sprint e por padrão seu valor é 1, ou seja,
          qualquer mensagem enviada fará a pessoa perder imediatamente. Caso
          queira permitir que ela possa enviar até uma mensagem, altera seu
          valor para 2 ou outro maior. <b>Bônus: </b> se acontecer de você já
          estar com um sprint em andamento, receber uma raid e quiser permitir que
          o pessoal agradeça a raid sem perder o jogo, o Streamer pode digitar
          !vida {"<numero>"} para acrescentar este número em vidas para todos
          participantes.
        </p>
      </Grid>

      <p className={classes.title}>5. Gostei, quanto custa pra usar?</p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          Custo um total de <b>R$ 0,00</b> reais. Se alguém tiver cobrando pra
          usar essa ferramenta, por favor a denuncie.{" "}
          <s style={{ fontSize: 12 }}>
            A gente vai caçar e socar a costela, foi o que disseram.
          </s>
        </p>
      </Grid>

      <p className={classes.title}>6. É confiável eu usar este site?</p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          Sim, essa ferramenta é integrada com o site da Twitch e o site do
          StreamElements, todas requisições feitas por aqui são apenas para
          esses 2 destinos sem nenhum intermediário. Este projeto tem o código
          aberto e qualquer pessoa (com conhecimento) pode auditar, se
          certificando de que todas informações são mantidas em segurança.{" "}
          <a
            href="https://github.com/unManiac/unsprint-twitch"
            rel="noreferrer"
            target="_blank"
          >
            Código fonte aqui.
          </a>
        </p>
      </Grid>

      <p className={classes.title}>
        7. Posso fazer alterações no código fonte e usar?
      </p>
      <Grid item xs={12}>
        <p className={classes.answer}>
          Claro, o objetivo é atender a necessidade de todos, mas sugiro
          fortemente que faça as modificações e envie a sugestão ao projeto
          original pois sua necessidade pode ser a necessidade de outra pessoa.
        </p>
      </Grid>
    </Grid>
  );
}
