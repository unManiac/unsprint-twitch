import {
  SPRINT_UPDATE,
  SPRINT_STARTED,
  SPRINT_CANCELLED,
  SPRINT_ENDED,
} from "../constants/actionTypes";

const initialState = {
  messageStarted:
    "Começamos a partida de unSprint, terá duração de @tempo e para participar digite !iniciar",
  messageEnded:
    "Acabou o unSprint de @tempo, sobreviventes podem resgatar seus pontos digitando !ganhei",
  messageConfirmation:
    "@nome entrou na partida faltando @tempo e se mandar mensagem no chat perderá 1 vida, no fim você ganhará @resultado.",
  messageBonus: "Todos participantes do unSprint ganharam @vida <3 <3 <3",
  multiplier: 2,
  lives: 1,
  minutes: 60,
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
      };
    case SPRINT_ENDED:
      return {
        ...state,
        ends: undefined,
        finished: true,
      };
    default:
      return state;
  }
};

export default sprint;
