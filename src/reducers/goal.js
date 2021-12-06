import { GOAL_UPDATE } from "../constants/actionTypes";

const initialState = {
  amount: 0,
  tips: [],
};

const goal = (state = initialState, action) => {
  switch (action.type) {
    case GOAL_UPDATE:
      let amount = state.amount;
      if (action.bits !== undefined) {
        amount += action.bits;
      }

      let tips = state.tips;
      if (action.tip !== undefined) {
        tips = [...tips, action.tip];
      }

      return {
        ...state,
        tips,
        amount,
      };
    default:
      return state;
  }
};

export default goal;

export const allTips = [
  `In the middle of the night, in my dreams / You should see the things we do, baby (mmm) / In the middle of the night, in my dreams / I know I'm gonna be with you / So I'll take my time / Are you ready for it? / Baby, let the games begin / Let the games begin`,
  `"Peaches" - IU`,
  `Bela e a fera - Xamã`,
  `Blank space e a maçã no clipe`,
  `Remember december - Demi Lovato`,
  `Wildest dreams - Taylor`,
  `Um surto que renderá novos surtos`,
  `Como já dizia Fátima Cialho, _______ sempre em 1° lugar`,
  `Ficamos afastados por um tempo, mas já senti saudades então voltei`,
  `Maçã do amor, quem não gosta?`,
  `I NEED YOU - BTS`,
  `E o vade mecum, minha gata, já lestes?`,
  `O nosso término me doeu demais, até hoje não superei`,
  `“A única maneira de fazer um grande trabalho é amando o que se faz.” - Steve Jobs`,
  `Já estava mais que na hora de nos reencontrarmos`,
  `Se quiser sair pra tomar um cafezin pode me levar`,
  `“O capeta é uma mulher, sorte que deus também era Azar o seu se ela não quer te dar Desconfie que quem trouxe o pecado foi Adão Tipo os que oferecem a maçã e não querem me pagar” Corre das notas - Djonga`,
  `“I live in two worlds. One is a world of books”`,
  `LORELAI: What do you mean, peanuts don't grow on trees? / RORY: Mom, trust me. I'm a college graduate.`,
  `Das suas lives posso até participar`,
  `Hey, December (Evermore - Taylor)`,
  `Don't be afraid, we'll make it out of this mess. It's a love story, baby, just say, "Yes" (Love story - Taylor)`,
  `And you know we don't stop / Hot like (summer) / Ain't no (bummer) / You be like: Oh, my God (Butter - BTS)`,
  `you broke me first - Tate McRae`,
  `So cover your eyes / I have a surprise (Birthday - Katy Perry)`,
  `Um lobo, um vampiro e uma garota nova na cidade`,
  `De papel não sou feito, mas de papel eu posso ser`,
  `A loira brigou, o dono pagou e o povo escutou`,
  `Murakami, Taylor Swift e você têm em algo com comum`,
  `7 rings - ariana`,
  `hello! hola! Bonjour!`,
  `Buscando o Cinturão do Sol, talvez você encontre uma luz`,
  `1ª pessoa do singular`,
  `Juntos a magia acontece`,
  `Dark horse - Katy Perry 00:55`,
  `Clipe do primeiro single de It's not me, It's you`,
  `Money - LISA`,
  `brutal - Olivia Rodrigo`,
];
