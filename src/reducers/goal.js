import { GOAL_REPLACE, GOAL_UPDATE } from "../constants/actionTypes";

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
    case GOAL_REPLACE:
      let newTips = state.tips;
      if (action.tips !== undefined) {
        newTips = action.tips;
      }

      return {
        ...state,
        tips: newTips,
      };
    default:
      return state;
  }
};

export default goal;

export const allTips = [
  { index: 1, title: `"Peaches" - IU` },
  { index: 2, title: `Bela e a fera - Xamã` },
  { index: 3, title: `Blank space e a maçã no clipe` },
  { index: 4, title: `Remember december - Demi Lovato` },
  { index: 5, title: `Wildest dreams - Taylor` },
  { index: 6, title: `Um surto que renderá novos surtos` },
  {
    index: 7,
    title: `Como já dizia Fátima Cialho, _______ sempre em 1° lugar`,
  },
  {
    index: 8,
    title: `Ficamos afastados por um tempo, mas já senti saudades então voltei`,
  },
  { index: 9, title: `Maçã do amor, quem não gosta?` },
  { index: 10, title: `I NEED YOU - BTS` },
  { index: 11, title: `E o vade mecum, minha gata, já lestes?` },
  { index: 12, title: `O nosso término me doeu demais, até hoje não superei` },
  {
    index: 13,
    title: `“A única maneira de fazer um grande trabalho é amando o que se faz.” - Steve Jobs`,
  },
  { index: 14, title: `Já estava mais que na hora de nos reencontrarmos` },
  { index: 15, title: `Se quiser sair pra tomar um cafezin pode me levar` },
  {
    index: 16,
    title: `“O capeta é uma mulher, sorte que deus também era Azar o seu se ela não quer te dar Desconfie que quem trouxe o pecado foi Adão Tipo os que oferecem a maçã e não querem me pagar” Corre das notas - Djonga`,
  },
  { index: 17, title: `“I live in two worlds. One is a world of books”` },
  {
    index: 18,
    title: `LORELAI: What do you mean, peanuts don't grow on trees? / RORY: Mom, trust me. I'm a college graduate.`,
  },
  { index: 19, title: `Das suas lives posso até participar` },
  { index: 20, title: `Hey, December (Evermore - Taylor)` },
  {
    index: 21,
    title: `Don't be afraid, we'll make it out of this mess. It's a love story, baby, just say, "Yes" (Love story - Taylor)`,
  },
  {
    index: 22,
    title: `And you know we don't stop / Hot like (summer) / Ain't no (bummer) / You be like: Oh, my God (Butter - BTS)`,
  },
  { index: 23, title: `you broke me first - Tate McRae` },
  {
    index: 24,
    title: `So cover your eyes / I have a surprise (Birthday - Katy Perry)`,
  },
  { index: 25, title: `Um lobo, um vampiro e uma garota nova na cidade` },
  { index: 26, title: `De papel não sou feito, mas de papel eu posso ser` },
  {
    index: 27,
    title: `In the middle of the night, in my dreams / You should see the things we do, baby (mmm) / In the middle of the night, in my dreams / I know I'm gonna be with you / So I'll take my time / Are you ready for it? / Baby, let the games begin / Let the games begin`,
  },
  { index: 28, title: `A loira brigou, o dono pagou e o povo escutou` },
  { index: 29, title: `Murakami, Taylor Swift e você têm em algo com comum` },
  { index: 30, title: `7 rings - ariana` },
  { index: 31, title: `hello! hola! Bonjour!` },
  {
    index: 32,
    title: `Buscando o Cinturão do Sol, talvez você encontre uma luz`,
  },
  { index: 33, title: `1ª pessoa do singular` },
  { index: 34, title: `Juntos a magia acontece` },
  { index: 35, title: `All I want for Christmas is you` },
  { index: 36, title: `Dark horse - Katy Perry 00:55` },
  { index: 37, title: `Clipe do primeiro single de It's not me, It's you` },
  { index: 38, title: `Money - LISA` },
  { index: 39, title: `brutal - Olivia Rodrigo` },
  {
    index: 40,
    title: `I hope you´re happy, just not like how you were with me I´m selfish, I know, can´t let you go So find someone great, don´t find no one better I hope you´re happy, but don´t be happier`,
  },
  { index: 41, title: `Jingle Bells` },
  { index: 42, title: `É de bom tom recusar presente? Nah, não é de bom tom` },
  {
    index: 43,
    title: `**** -> agrado, carinho, atenção especial de alguém a outrem`,
  },
  {
    index: 44,
    title: `I’m a *****, I’m a boss I’m a ***** and a boss, I’ma shine like gloss`,
  },
  {
    index: 45,
    title: `I think that I want it It's all I really need You say that you want it Just tell it straight to me`,
  },

  {
    index: 50,
    title: `Pista ? Será ? Ah poxa, não foi dessa vez. Dessa vez é só p te lembrar da mulher maravilhosa que tu é. Fafa, só queria expressar um tico do meu carinho por ti, vc é uma pessoa inspiradora, e é nítido ao olhar p ti o quão forte vc é, fico muito feliz por ter tido a oportunidade de conhecer e de me tornar alguém próxima de ti, espero que isso só se intensifique a cada dia mais! Vc merece o mundo, e todo esse surto é só uma demonstração mto grande de amor por ti, é que te deixar um tico surtada faz parte hihi ! Vc é muito especial e obrigada por tanto, te amo flavsf1Peach  (titia_mc)`,
  },
  {
    index: 51,
    title: `oiiii, sua cara de chibata, tudo bom? só estou passando aqui para desejar um feliz aniversário, que você tenha muita saúde (TÁ PRECISANDO HEIN, SE LIGAAA) e que você foi um dos grandes presentes que esse 2021 ferrado me deu. tamo junto e se achar ruim vou ai dar na sua cara. weeee (Leilanewood)`,
  },
  {
    index: 52,
    title: `oi, fafa. Imagina que faz quase um ano que te conheci, hein? um tempinho atrás, vc perguntou o motivo de eu ter dado o primeiro sub do canal e vim te responder: por vc ser essa pessoa incrível e cativante, que em pouco tempo conquista a gente e nos faz querer voltar todos os dias. obrigada, viu? por me apoiar desde o começo, por me fazer companhia, enfim, por ser vc ❤️ saiba que tu mora no meu coração dark trevoso 666 from hell. (barbaradoquorthon)`,
  },
  {
    index: 53,
    title: `Parabéns Fafa você merece o mundo é uma pessoa incrível e ao mesmo tempo caótico te admiro muito como pessoa que você realize todos os seus objetivos 😘 (Ana Luh)`,
  },
  {
    index: 54,
    title: `Feliz aniversário fafa, acredito que em meio esse surto você esteja chorando, não? Que chore então. Quero te desejar todas as coisas boas desse mundo, você é uma das melhores pessoas que eu comecei a acompanhar e fazer parte dessa família é uma honra. Continue sendo essa mulher maravilhosa e caótica que você é, pois esse seu jeito que faz tudo ser tão especial e amado, bjaaoo flavsf1Peach flavsf1Cafe (viviioliveira)`,
  },
  {
    index: 55,
    title: `Opa, mais pista?! Na verdade é apenas um agradecimento por poder fazer parte dessa comunidade perfeita que você fez crescer, pelos grandes aprendizados, por todos os surtos e sustos e risadas, por ter salvado muitos de nós do isolamento e da solidão nesses tempos sombrios e por ser essa mulé f*da que tanto inspira a gnt! Obrigada de vdd por tudo, Fafá! Vc é perfeita! ❤️  !chora (drika_admoal)
  `,
  },
  {
    index: 56,
    title: `Toda dupla tem uma que é mais legal, mais bonita, mais engraçada, mais inteligente, mais gente boa. E do outro lado, tem a Flávia. Infelizmente fui obrigada a desejar coisas boas no seu aniversário, pois faz parte do marketing. Então, espero que a vida seja mais leve, que traga mais felicidade, que seja generosa e gentil o tanto quanto você é com as pessoas (de um jeitinho meio caótico? sim. Mas é o que tá tendo). Te desejo tudo de melhor fafa e te amo infinitamente. Feliz aniversário! (Sua inimiga: Aya literosa)`,
  },
  {
    index: 57,
    title: `Eaeee, Flavs, tudo bom? Conhecer este canal INCRÍVEL e os pesseguinhos foi TUDO para mim, sério! Meus dias com certeza nunca mais foram os mesmos e isso tudo graças a principalmente você! Essa pessoa, que apesar de ser ba*****, é incrível, com uma energia poderosa (tarô ta sabendo ein, se liga), simpática, inteligentísima e capaz de conseguir cada vez mais coisas boas na vida. Essa comunidade não seria a mesma sem você (talvez nem uma comunidade tão unida). Não estou muito presente aqui na twitch, mas espero que as lives estejam incríveis (o que sei que com certeza estão ainda mais com essas pessoas MARAVILHOSAS) (braziliiangirl)`,
  },
  { index: 41, title: `` },
  { index: 41, title: `` },
].map((t) => ({ ...t, index: t.index - 1 }));
