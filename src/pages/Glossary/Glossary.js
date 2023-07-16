import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { GREEN } from "../../constants/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
  },
  title: {
    color: GREEN,
    fontWeight: "bold",
    marginTop: 60,
  },
  comando: {
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #000",
    padding: "20px 0",
    "& strong": {
      maxWidth: 220,
      minWidth: 220,
      paddingRight: 15,
    },
    "& div": {
      fontSize: 18,
      marginLeft: 5,
    },
  },
  obs: {
    display: "flex",
    marginTop: 20,
  },
}));

export default function Glossary() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={1} alignItems="center">
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1>Comandos no chat</h1>
      </Grid>

      <Grid item xs={12}>
        <h2 className={classes.title}>Bot de Sprint (Streamer/Mod*):</h2>

        <div className={classes.obs}>
          * Apenas se tiver habilitado para mods usarem os comandos.
        </div>

        <Grid item className={classes.comando}>
          <strong>!un XX</strong>
          <div>
            XX são os minutos, digite !un 60 para iniciar um sprint de 60
            minutos, caso precise alterar o tempo é só digitar novamente !un YY,
            sendo YY o tempo que falta.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un cancelar</strong>
          <div>Cancela o sprint atual, ninguém recebe pontos.</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un encerrar</strong>
          <div>
            Finaliza o sprint antes do tempo, todos recebem os minutos de forma
            integral, mesmo que encerrado antes.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un vida X</strong>
          <div>
            X é a quantidade de vida, !un vida 5 irá distribuir 5 de vida a mais
            para cada participante. Recomendado quando chegar raid.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>
            !un vida on
            <br />
            !un vida off
          </strong>
          <div>
            Habilita/desabilita a mecânica de vidas no sprint, quando digitar o
            comando do "off" todos podem digitar no chat sem perder vida. Digite
            "on" para habilitar de volta.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un atualiza</strong>
          <div>
            Força atualização do bot, recomendado quando o bot estiver
            duplicando mensagens ou desatualizado, funciona mesmo dentro do OBS.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un vips</strong>
          <div>
            Lista todos usuários que estão no multiplicador especial. Esta
            multiplicação especial é indicada como um benefício exclusivo,
            exemplo assinantes de seu catarse.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un addvip @usuario</strong>
          <div>
            Adiciona um novo usuário para ter direito ao multiplicador especial,
            é possível adicionar mais de um usuário ao mesmo tempo separando por
            espaço ou vírgula, exemplo: !un addvip @usuario1 @usuario2
            @usuario3.
            <br />@ é opcional.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un removevip @usuario</strong>
          <div>
            Remove um novo usuário do multiplicador especial, é possível remover
            mais de um usuário ao mesmo tempo separando por espaço ou vírgula,
            exemplo: !un addvip @usuario1 @usuario2 @usuario3.
            <br />@ é opcional.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un multiplicadorvip X</strong>
          <div>X é o valor do multiplicador especial.</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!un resetavip</strong>
          <div>Remove TODOS usuários do multiplicador especial.</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>
            !un loja pausa
            <br />
            !un loja restaura
          </strong>
          <div>
            Loja é a lojinha do StreamElements, o comando de pausa é recomendado
            quando você quiser pausar o resgate de todos itens, sem precisar
            fazer um a um manualmente. O comando de restaura é para habilitar
            novamente o que foi pausado.
          </div>
        </Grid>

        <h2 className={classes.title}>Bot de Sprint (Viewer):</h2>

        <Grid item className={classes.comando}>
          <strong>
            !i
            <br />
            !iniciar
          </strong>
          <div>
            Após iniciado o sprint, todos pessoas do chat podem entrar no foco
            digitando qualquer um desses comandos: !i, !iniciar, !estudar,
            !trabalhar, !foco, !sprintei
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>
            !g
            <br />
            !ganhei
          </strong>
          <div>
            Quando o tempo do sprint acabar, quem participou pode resgatar seus
            pontos digitando QUALQUER coisa no chat, antigamente precisava ser
            esse comando específico, mas atualmente é qualquer texto.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!vida</strong>
          <div>Para saber quantas vidas você ainda tem no sprint.</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!tempo</strong>
          <div>
            Para saber com quanto tempo você entrou no sprint e quantos pontos
            você vai ganhar.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!timer</strong>
          <div>Para saber quanto tempo falta no crônometro. (em minutos)</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>
            !m
            <br />
            !minutos
          </strong>
          <div>
            Conferir quando foi seu último resgate e qual sua posição no ranking
            semanal do bot. Este ranking não é idêntico ao ranking do
            maratona.app, apesar das informações serem relacionadas.
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!unranking</strong>
          <div>Conferir o top 3 do ranking semanal do bot.</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!unsprint</strong>
          <div>Explica brevemente o que é o unSprint.</div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>
            !estante
            <br />
            !estante @usuario
          </strong>
          <div>
            Compartilha o link para acessar as estantes do usuário no
            maratona.app
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>
            !quiz
            <br />
            !quiz @usuario
          </strong>
          <div>
            Compartilha o link para jogar o "Qual a capa?" usando as estantes do
            usuário no maratona.app
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!unlivro</strong>
          <div>
            Calcula qual sua porcentagem da leitura atual, o comando precisa ser
            nessa ordem: !unlivro possui 300, começa na 20 e estou na 50
          </div>
        </Grid>

        <Grid item className={classes.comando}>
          <strong>!calcula</strong>
          <div>
            Calcula quantos minutos foram adicionados nas lives infinitas:
            !calcula se 100 bits = 5min, quantos são 20 bits?
          </div>
        </Grid>

        <h2 className={classes.title}>Bot do Forest (Streamer/Mods):</h2>

        <Grid item className={classes.comando}>
          <div>Acesse a aba "Forest" no topo do site.</div>
        </Grid>
      </Grid>
    </Grid>
  );
}
