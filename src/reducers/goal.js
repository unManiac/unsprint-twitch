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
  {
    index: 58,
    title: `oi Fafa, tudo bom? Lá vem história: Em Dezembro de 2020 existia uma garota passando por diversos problemas e desafios, sem rumo e sem propósito. Em meio à uma pandemia catastrófica, sem poder sair e socializar, ela se apaixonou pelos livros. E cada vez mais submersa nesse mundo, a garota resolveu adentrar na booktwitch. Os primeiros dias foram confusos, ela ainda estava se familiarizando com a plataforma e ainda não havia encontrado a comunidade certa. Até que em Junho de 2021, ela encontrou a família pessegaya! Foi muito bem acolhida, e os dias que antes eram decepcionantes e monótonos passaram a ser cada vez mais especiais. No dia 16+1 de Dezembro, completarei 6 meses de família pessegaya, e coincidentemente também se comemora a vida de uma das personalidades mais fortes e fodas que já conheci. Fafa, você é o motivo dos meus dias serem melhores, devo todo meu amor e carinho à vocês! Com amor, Isa. (isa_carlini)`,
  },
  {
    index: 59,
    title: `Fafa saiba que você  é  uma pessoa  maravilhosa, você é  incrível  demais, te admiro muito,  você é  uma pessoa  de muita  luz  que merece  sempre coisas maravilhosas  e incríveis  sempre, obrigada  por essa família  que é  a família  pessegada 💜 (Lais Nunes)`,
  },
  {
    index: 60,
    title: `Tá chegando o dia de uma das melhores pessoas que eu tenho por perto... Te desejo as melhores coisas dessa vida toda, obrigada por ser minha dupla e por cuidar tanto de nós. Sou grata por todo carinho, esforço e cada puxão de orelha que você me dá. Te amo, te amo, te amo. Pra sempre. ❤️ (Isa, a maior)`,
  },
  {
    index: 61,
    title: `oieeerrrr erm então parece que tem uma lenda da internet de aniverrrr hein me falaram que é a maior que já existiu e que ela deixa todo mundo feliz com umas live aí e que ela odeia ler nunca terminou it já faz 6 anos e meio foi o que me falaram FAFA MTAS FELICIDADES TUDO DE BOM CONTINUE SENDO A MAIOR DA INTERNET A MAIOR DOS SURTOS E DOS SUSTOS A MAIOR DE NÃO PASSAR DA PRIMEIRA NO FALL GUYS POR FAVOR DANÇA ZIMZALABIM TE AMO KISSES (Yago)`,
  },
  {
    index: 62,
    title: `Filha, você é mais que especial. Filha, amiga, confidente e irmã maravilhosa. Inteligente, brilhante, um ser humano iluminado. Te amo! (Fafa mãe)`,
  },
  {
    index: 63,
    title: `Oii Flávia, espero q nessa altura vc ja tenha descoberto a meta secreta, e se não descobriu, presta atenção aí kkkk Passando rapidinho pra te falar que vc é uma pessoa incrível (e surtada rs), e vc merece o mundo!! Continue sendo essa pessoa maravilhosa que vc é, com esses seus surtos q a gente tanto ama 💜 Suas lives e o pessoal do discord me fazem companhia em muitos momentos, sempre q apareço por aqui ou no discord sempre acontece momentos marcantes (sendo engraçados, reflexivos, de ajuda, dentre muitos outros), e sou grata por vc ter apresentado essa comunidade incrível 💜 Falei de mais pra uma dica q não é dica né kkkkk Obs: surta e chora q da bits viu (assim vc descobre as outras pistas mais rápido rs) 😂💜 (Gaby)`,
  },
  {
    index: 64,
    title: `Fala minha musa inspiradora ❤️ curtindo muito seu dia? Vou comemorar por você dando um tibum aqui em porto das galinhas. Te amo! E só pra fechar quero dizer que te amo e sou grata pela sua amizade. Que agora em 2022 eu possa conhecer ainda mais sua nova versão. Sei que meu amor só vai crescer. Obrigada por tanto, sempre. Feliz aniversário!! (Jéssica)`,
  },
  {
    index: 65,
    title: `Flávia, você é fonte de inspiração e orgulho para muitos de nós  . Eu sou muito grata por ter te conhecido esse ano, e espero acompanhar você por outros anos. Feliz aniversário! (Diimartell)`,
  },
  {
    index: 66,
    title: `Já faz quase um ano que eu te conheci... essa pessoa incrível, empática, carismática, que fala o que pensa e não mede esforços pra defender quem ama. Fafa, te admiro muito por quem vc é e pelo q vc significa pra mim: a primeira streamer que acompanhei de verdade e que teve a paciência de Jó pra me ensinar a dar sub e muitas outras patetiadas tecnológicas. Mas acima de tudo, uma amiga em quem eu confio e desejo todo o sucesso do universo pq tu merece. Um bjao ♡♡♡ (Gabiii)`,
  },
  {
    index: 67,
    title: `fafa, eu poderia encher isso aqui de referências da taylor porque as vezes ela sabe traduzir meus sentimentos melhor que eu mesma, mas eu só queria falar que te amo muito e que serei sempre grata por te ter na minha vida, tá? você é foda, linda, inteligente, dedicada, gentil, e uma grande inspiração pra mim. espero que não me odeie pelos nossos surtos #pas #tiamo #pista (Millie - warmchapters)`,
  },
  {
    index: 68,
    title: `Oi fafa, desde o momento que eu te conheci senti uma conexão boa, e nunca pensei que um dia poderia te chamar de amiga, você é uma pessoa incrível, mesmo surtada continua sendo uma pessoa incrível que mesmo com os altos e baixos sempre tá lá por todo mundo e mesmo quando todo mundo tá na pior você deixa a gente feliz, agradeço muito ao universo por ter colocado você na minha vida, obrigado por todas as risadas, todos os xingos, todas as partidas de vava, todos os sermões, todas as madrugadas em call surtando . Cada coisinha que você faz mostra o quão você é incrível e que vai crescer muito ainda na twitch eu tenho certeza disso, o seu jeito surtada de ser cativa todo mundo e ter encontrado uma pessoa como eu na twitch e essa pessoa ser uma mulher foda pra caralho me inspira cada dia mais, e eu sou muito feliz de poder fazer parte dessa tropinha incrível da pessegada e por ter uma pessoa incrível que eu posso chamar de amiga, te amo fafa Ass: A SURTADA DO CAPS (olha nem usei caps dessa vez #tapassada?)`,
  },
  {
    index: 69,
    title: `Oieeee Fafaa, passando aqui pra te desejar os parabénsssss, espero que tu seja muito feliz, tenha muitos anos de vida e realize todos os seus sonhos! Tu é uma pessoa incrível demais e eu sou muito grata por ter te conhecido! Sem dúvidas, esse foi um dos melhores acontecimentos do meu ano! Tu merece tudo de bom que o mundo tem a oferecer mulher, tu é muito especiall!!!! Feliz Aniversáriooo, espero que o teu dia seja maravilhoso, assim como vc é! ❤️❤️❤️ (Samivilas)`,
  },
  {
    index: 70,
    title: `oi fafa, feliz aniversário!!! tudo di bom pra vc sempre, obrigado por tudo o que vc ja me ensinou, pelos momentos bons e cheios de risadas, por tudo oq vc ja fez por mim e pelas suas lives maravilhosas que sempre alegram meus dias. n sei mais oq falar entao #chupaflavia #taficandoidosa flavsf1Taymandrake (Juniorbebah)`,
  },
  {
    index: 71,
    title: `oi Fafa, turu bom? Sei que ainda não é seu aniversário, mas você merece parabéns todos os dias né minha gata, principalmente por essa comunidade incrível que vc criou e lutou tanto pra dar certo e ser unida. Eu serei eternamente grata por vc ter entrado na minha vida num momento que eu estava totalmente perdida e por ter me ajudado a me encontrar, a conhecer outras partes de mim que eu nem sonhava que existiam. Não posso deixar de te agradecer por me tratar com tanto carinho sempre, ás vezes me sinto como sua irmã mais nova mesmo que vc grita pra pedir socorro com a tecnologia sabe kkkkkkkk E eu tenho sempre um enorme prazer em ir atrás das coisas pra te ajudar. Espero conseguir conhecer as futura Flávias pq a cada dia vc é uma mulher mais e mais incrível, inteligente, dedicada, empática e companheira. Por fim, obrigada por ser vc, mostrar pra gente qm é a fafa mesmo, bem surtada, chorona e mt carinhosa. Bjaoo #nãomedemite #teamo #souinocente (Luisinha)`,
  },
  {
    index: 72,
    title: `Fafa, a Internet é um lugar muitas vezes muito sombrio. E encontrar luz às vezes não é muito fácil! Mas eu sou muito grata que te encontrei em meio a tudo isso. Especialmente porque você é aquela pessoa que nos impulsiona, que acredita na gente. Sou grata pela sua amizade e por ter te encontrado. Era pra ser essa amizade do pop! Amo você! (Prima Thaís)`,
  },
  {
    index: 73,
    title: `entrei em 2021 me afogando em leituras pra tapar um buraco provocado por uma perda. Me sentia sozinha num mar de gente que tava negligenciando um pouco a pandemia e minha perda. Mas aí veio a twitch e logo mais a recomendação de um canal: flavsfff. Tudo se encaixou. Além de uma companhia virtual (que hj pra mim representa uma realidade, algo concreto), eu fui me encontrando com outras pessoas que tinham os mesmos sentimentos que eu e que buscavam acolhimento, carinho, pertencimento. Realmente, as correntes foram se juntando e formando um grande elo sem fim. Talvez, Fafa, mesmo antes de vc definir nossa música como Invisible String, ela já estava presente ali. Vc foi o primeiro membro dessa corrente, a primeira a plantar e semear a sementinha. E dela vc criou vida, criou amor, criou união, criou um abraço apertado mesmo estando tão longe, criou laços que talvez sejam inseparáveis a partir de agora: os pesseguinhos. Parabéns por ser essa mulher de ouro, e que com toda certeza tenho orgulho de dizer que conheci e que sou próxima. Parabéns por acreditar na sua verdade e por lutar pela concretização da mesma. Parabéns por ser genuína, afinal "eu sou carioca" já diz grande parte disso kkkkkkkk que seu ano novo seja cheio de realizações e conquistas, de muita alegria, trabalho, xamã (alô, agnes! Se liga hein), loirinha, amizades e acolhimento. Esse último eu gostaria de retribuir a vc mil vezes se for possível, pq foi nessa família que eu escolhi ser acolhida, escolhi sentar pra desfrutar aquele almoço de família. Aqui eu somo e espero somar muito mais com vc e com os pessegos. Um beijaooooo, te pessegamo <3 (Vic)`,
  },
  {
    index: 74,
    title: `oi, fafa, bom dia flavsf1Peach desde a primeira live que eu vi e pude te conhecer, eu senti que algo importante ia acontecer na minha vida.. eu só não imaginava que fosse tanto assim. achei que teria apenas conhecido gente legal pra falar de livros, ou que talvez pudesse tirar uma única amizade disso... mas eu ganhei uma FAMÍLIA. eu sou extremamente grata por ter encontrado minha casa e ser um pesseguinho (off que até uma Fialho eu sou). obrigada por me ensinar tanta coisa sempre, mostrar visões diferentes e causar tanta reflexão, você me ajuda a crescer e ser alguém melhor. af, morro de orgulho da mulher FODA que vc é, perfeitaaaaaaaa!! TE AMO E FELIZ ANIVERSÁRIO beeijão <3 [off: me sinto adorável com os surtos das pistas weeee. (izzy)`,
  },
].map((t) => ({ ...t, index: t.index - 1 }));
