import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import { GREEN } from "../../constants/colors";

const RootContainer = styled("div")(({ theme }) => ({
  marginTop: 30,
}));

const Title = styled("h2")(({ theme }) => ({
  color: GREEN,
  fontWeight: "bold",
  marginTop: 60,
}));

const Command = styled(Grid)(({ theme }) => ({
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
}));

const ObservationText = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: 20,
}));

export default function Glossary() {
  return (
    <RootContainer>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h1>Comandos no chat</h1>
        </Grid>

        <Grid item xs={12}>
          <Title>Bot de Sprint (Streamer/Mod*):</Title>
          <ObservationText>
            * Apenas se tiver habilitado para mods usarem os comandos.
          </ObservationText>{" "}
          <Command>
            <strong>!un XX</strong>
            <div>
              XX são os minutos, digite !un 60 para iniciar um sprint de 60
              minutos, caso precise alterar o tempo é só digitar novamente !un
              YY, sendo YY o tempo que falta.
            </div>
          </Command>
          <Command>
            <strong>!un cancelar</strong>
            <div>Cancela o sprint atual, ninguém recebe pontos.</div>
          </Command>
          <Command item>
            <strong>!un encerrar</strong>
            <div>
              Finaliza o sprint antes do tempo, todos recebem os minutos de
              forma integral, mesmo que encerrado antes.
            </div>
          </Command>
          <Command item>
            <strong>!un vida X</strong>
            <div>
              X é a quantidade de vida, !un vida 5 irá distribuir 5 de vida a
              mais para cada participante. Recomendado quando chegar raid.
            </div>
          </Command>
          <Command item>
            <strong>
              !un vida on
              <br />
              !un vida off
            </strong>
            <div>
              Habilita/desabilita a mecânica de vidas no sprint, quando digitar
              o comando do "off" todos podem digitar no chat sem perder vida.
              Digite "on" para habilitar de volta.
            </div>
          </Command>
          <Command item>
            <strong>!un atualiza</strong>
            <div>
              Força atualização do bot, recomendado quando o bot estiver
              duplicando mensagens ou desatualizado, funciona mesmo dentro do
              OBS.
            </div>
          </Command>
          <Command item>
            <strong>!un vips</strong>
            <div>
              Lista todos usuários que estão no multiplicador especial. Esta
              multiplicação especial é indicada como um benefício exclusivo,
              exemplo assinantes de seu catarse.
            </div>
          </Command>
          <Command item>
            <strong>!un addvip @usuario</strong>
            <div>
              Adiciona um novo usuário para ter direito ao multiplicador
              especial, é possível adicionar mais de um usuário ao mesmo tempo
              separando por espaço ou vírgula, exemplo: !un addvip @usuario1
              @usuario2 @usuario3.
              <br />@ é opcional.
            </div>
          </Command>
          <Command item>
            <strong>!un removevip @usuario</strong>
            <div>
              Remove um novo usuário do multiplicador especial, é possível
              remover mais de um usuário ao mesmo tempo separando por espaço ou
              vírgula, exemplo: !un addvip @usuario1 @usuario2 @usuario3.
              <br />@ é opcional.
            </div>
          </Command>
          <Command item>
            <strong>!un multiplicadorvip X</strong>
            <div>X é o valor do multiplicador especial.</div>
          </Command>
          <Command item>
            <strong>!un resetavip</strong>
            <div>Remove TODOS usuários do multiplicador especial.</div>
          </Command>
          <Command item>
            <strong>
              !un loja pausa
              <br />
              !un loja restaura
            </strong>
            <div>
              Loja é a lojinha do StreamElements, o comando de pausa é
              recomendado quando você quiser pausar o resgate de todos itens,
              sem precisar fazer um a um manualmente. O comando de restaura é
              para habilitar novamente o que foi pausado.
            </div>
          </Command>
          <Title>Bot de Sprint (Viewer):</Title>
          <Command item>
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
          </Command>
          <Command item>
            <strong>
              !g
              <br />
              !ganhei
            </strong>
            <div>
              Quando o tempo do sprint acabar, quem participou pode resgatar
              seus pontos digitando QUALQUER coisa no chat, antigamente
              precisava ser esse comando específico, mas atualmente é qualquer
              texto.
            </div>
          </Command>
          <Command item>
            <strong>!vida</strong>
            <div>Para saber quantas vidas você ainda tem no sprint.</div>
          </Command>
          <Command item>
            <strong>!tempo</strong>
            <div>
              Para saber com quanto tempo você entrou no sprint e quantos pontos
              você vai ganhar.
            </div>
          </Command>
          <Command item>
            <strong>!timer</strong>
            <div>Para saber quanto tempo falta no crônometro. (em minutos)</div>
          </Command>
          <Command item>
            <strong>
              !m
              <br />
              !minutos
            </strong>
            <div>
              Conferir quando foi seu último resgate e qual sua posição no
              ranking semanal do bot. Este ranking não é idêntico ao ranking do
              maratona.app, apesar das informações serem relacionadas.
            </div>
          </Command>
          <Command item>
            <strong>!unranking</strong>
            <div>Conferir o top 3 do ranking semanal do bot.</div>
          </Command>
          <Command item>
            <strong>!unsprint</strong>
            <div>Explica brevemente o que é o unSprint.</div>
          </Command>
          <Command item>
            <strong>
              !estante
              <br />
              !estante @usuario
            </strong>
            <div>
              Compartilha o link para acessar as estantes do usuário no
              maratona.app
            </div>
          </Command>
          <Command item>
            <strong>
              !quiz
              <br />
              !quiz @usuario
            </strong>
            <div>
              Compartilha o link para jogar o "Qual a capa?" usando as estantes
              do usuário no maratona.app
            </div>
          </Command>
          <Command item>
            <strong>!unlivro</strong>
            <div>
              Calcula qual sua porcentagem da leitura atual, o comando precisa
              ser nessa ordem: !unlivro possui 300, começa na 20 e estou na 50
            </div>
          </Command>
          <Command item>
            <strong>!calcula</strong>
            <div>
              Calcula quantos minutos foram adicionados nas lives infinitas:
              !calcula se 100 bits = 5min, quantos são 20 bits?
            </div>
          </Command>
          <Command item>
            <strong>!acaba</strong>
            <div>
              Calcula quando a live vai acabar de acordo com as horas
              informadas, recomendado nas lives infinitas: !acaba em 48h
            </div>
          </Command>
          <Title>Bot do Forest (Streamer/Mods):</Title>
          <Command item>
            <div>Acesse a aba "Forest" no topo do site.</div>
          </Command>
        </Grid>
      </Grid>
    </RootContainer>
  );
}
