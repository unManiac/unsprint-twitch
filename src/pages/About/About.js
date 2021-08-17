import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { BLUE, GREEN } from "../../constants/colors";

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

const Question = ({ title, children }) => {
  const classes = useStyles();

  return (
    <>
      <p className={classes.title}>{title}</p>
      <Grid item xs={12}>
        <p className={classes.answer}>{children}</p>
      </Grid>
    </>
  );
};

export default function About() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={1} alignItems="center">
      <Question title="1. O que é o unSprint?">
        É uma ferramenta que permite Streamers engajar e premiar pessoas que
        querem fazer parte do sprint.{" "}
        <s style={{ fontSize: 12 }}>
          Também conhecido como Vaca Amarela v2.0, que é muito melhor que aquele
          outro bot que tem por ai, sem ofender.
        </s>
      </Question>

      <Question title="2. Como faço para configurar?">
        Clique na aba de Configuração no topo do site e siga o passo a passo.
      </Question>

      <Question title="3. Como usar?">
        O Streamer apenas precisa ir na página de Sprint localizado no menu ao
        topo, informar os detalhes do Sprint, clicar em Salvar e quando desejado
        Iniciar o Sprint. A partir desse momento será enviado uma mensagem no
        chat para que as pessoas leiam e comecem a interagir com essa
        ferramenta.
      </Question>

      <Question title="4. Posso sair do site depois que começa o sprint?">
        <b style={{ color: "red" }}>Não,</b> a ferramenta funciona apenas
        enquanto esse site tiver aberto na tela de Sprint, se você tiver com ele
        fechado ou na tela de Configurações não terá reação os comandos
        digitados no chat.
      </Question>

      <Question title="5. Se eu sair do site e depois voltar, minhas configurações vão ficar salvas?">
        <b>Sim,</b> todas personalizações e configurações ficam salvas, caso
        inicie um sprint e saia acidetalmente do site, assim que você voltar na
        página vai estar funcionando como anteriormente, com o timer atualizado
        e todos participantes.
      </Question>

      <Question title={`6. O que são "Vidas"?`}>
        A Vida permite que o participante do sprint possa enviar uma mensagem no
        chat sem perder seu ansioso prêmio, a quantidade de Vidas é configurável
        na tela de Sprint e por padrão seu valor é 1, ou seja, qualquer mensagem
        enviada fará a pessoa perder imediatamente.
        <br /> <br />
        <b style={{ color: "red" }}>Importante: </b> Ficar com <i>Zero</i> vidas
        significa perder, portanto caso queira queira permitir que a pessoa
        possa enviar 1 mensagem sem perder, o valor de vidas <b>precisa</b> ser
        2.{" "}
        <span style={{ color: "red" }}>
          Os comandos do unSprint não tiram vida, mas os comandos do seu canal
          e outras mensagens sim.
        </span>
        <br /> <br />
        <b style={{ color: BLUE }}>Bônus: </b> Se acontecer de você já estar com
        um sprint em andamento, receber uma raid e quiser permitir que o pessoal
        agradeça a raid sem perder o jogo, o Streamer pode digitar !vida{" "}
        {"<numero>"} para acrescentar este número em vidas para todos
        participantes.
      </Question>

      <Question title="7. Gostei, quanto custa pra usar?">
        Custo um total de <b>R$ 0,00</b> reais. Se alguém tiver cobrando pra
        usar essa ferramenta, por favor a denuncie.{" "}
        <s style={{ fontSize: 12 }}>
          A gente vai caçar e socar a costela, foi o que disseram.
        </s>
      </Question>

      <Question title="8. É confiável eu usar este site?">
        Sim, essa ferramenta é integrada com o site da Twitch e o site do
        StreamElements, todas requisições feitas por aqui são apenas para esses
        2 destinos sem nenhum intermediário. Este projeto tem o código aberto e
        qualquer pessoa (com conhecimento) pode auditar, se certificando de que
        todas informações são mantidas em segurança.{" "}
        <a
          href="https://github.com/unManiac/unsprint-twitch"
          rel="noreferrer"
          target="_blank"
        >
          Código fonte aqui.
        </a>
      </Question>

      <Question title="9. Posso fazer alterações no código fonte e usar">
        Claro, o objetivo é atender a necessidade de todos, mas sugiro
        fortemente que faça as modificações e envie a sugestão ao projeto
        original pois sua necessidade pode ser a necessidade de outra pessoa.
      </Question>
    </Grid>
  );
}
