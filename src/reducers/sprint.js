import {
  SPRINT_UPDATE,
  SPRINT_STARTED,
  SPRINT_CANCELLED,
  SPRINT_ENDED,
} from "../constants/actionTypes";

export const initialState = {
  messageStarted:
    "Começamos a partida de unSprint, terá duração de @tempo minutos e para participar digite !iniciar",
  messageEnded:
    "Acabou o unSprint de @tempo minutos, sobreviventes podem resgatar seus pontos digitando !ganhei",
  messageConfirmation:
    "@nome entrou na partida faltando @tempo minutos e se mandar mensagem no chat perderá 1 vida, no fim você ganhará @resultado.",
  messageTime:
    "@nome entrou com @tempo minutos e irá ganhar @resultado no final.",
  messageBonus: "Todos participantes do unSprint ganharam @vida <3 <3 <3",
  messageAlreadyConfirmed: "@nome já está participando.",
  messageAnxious: "@nome está com muita ansiedade.",
  messageLate: "@nome não está participando.",
  messageFinished:
    "@nome sobreviveu e ganhou @resultado. Seu novo total é @total.",
  warnMissingLives: true,
  modImmune: true,
  multiplier: 2,
  multiplierSub: 0,
  multiplierVip: 0,
  lives: 1,
  minutes: 60,
  ranking: true,
  rankingPrize1: undefined,
  rankingPrize2: undefined,
  rankingPrize3: undefined,
};

const sprint = (state = initialState, action) => {
  switch (action.type) {
    case SPRINT_UPDATE:
      return {
        ...state,
        ...initialState, // restore messages
        ...action.sprint,
      };
    case SPRINT_STARTED:
      return {
        ...state,
        ...action.sprint,
        finished: false,
      };
    case SPRINT_CANCELLED:
      return {
        ...state,
        started: undefined,
        ends: undefined,
        finished: false,
      };
    case SPRINT_ENDED:
      return {
        ...state,
        ended: state.ends,
        ends: undefined,
        finished: true,
      };
    default:
      return state;
  }
};

export default sprint;
