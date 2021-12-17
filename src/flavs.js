import { GOAL_REPLACE, GOAL_UPDATE } from "./constants/actionTypes";
import { allTips } from "./reducers/goal";
import { store } from "./store";

const total = 80000;
const tipAmount = 500;
const user = "flaviafialho";

function onCheerHandler({
  target,
  userstate,
  message,
  twitch,
  dispatch,
  ...rest
}) {
  if (!target.includes(user)) {
    return;
  }

  if (!userstate) {
    checkMessage({ target, twitch, message, dispatch, ...rest });
    return;
  }

  const { goal } = store.getState();
  const amount = parseInt(userstate.bits);

  if (amount + goal.amount < total) {
    twitch.action(
      target,
      `@${
        userstate.username
      } contribuiu com ${amount} bits e agora a meta secreta está em ${
        amount + goal.amount
      }/${total} flavsf1Princesa`
    );
  } else if (goal.amount > total) {
    twitch.action(
      target,
      `flavsf1Princesa flavsf1Princesa flavsf1Princesa A meta foi batida, @${userstate.username} PARA DE DAR BITS SE NÃO EU VOU TE CAÇAR E TE METER UM SOCO NA COSTELA flavsf1Princesa flavsf1Princesa flavsf1Princesa`
    );
  }

  let tipIndex = undefined;
  if (amount === tipAmount) {
    let tip = retrieveTip();
    if (!tip) {
      twitch.action(
        target,
        "As dicas acabaram, pergunte pra alguma mod se vai ter mais. flavsf1Cafe"
      );
      return;
    }

    tipIndex = tip.index;

    if (tip.index <= 49) {
      twitch.action(target, tip.title);
    } else {
      twitch.action(target, "Pagou por pista e vai levar depoimento <3 <3 <3");
      sayLongText({ twitch, target, text: tip.title });
    }
  }

  dispatch({
    type: GOAL_UPDATE,
    bits: amount,
    tip: tipIndex,
  });
}

function retrieveTip() {
  const { goal } = store.getState();

  if (goal.tips.length === 0) {
    return allTips[0];
  }

  const tipsNotSelected = allTips.filter((t) => !goal.tips.includes(t.index));
  const tip = pickRandomTip(tipsNotSelected);

  return tip;
}

function pickRandomTip(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function checkMessage({ target, twitch, message, dispatch, isMod }) {
  if (!message) {
    return;
  }

  const { goal } = store.getState();

  if (message === "pista!") {
    twitch.action(
      target,
      `Está rolando uma meta secreta (que nem a fafa sabe o que é). Pistas são desbloqueadas com 500 bits para desvendar esse enigma surtado. Lembrando que qualquer valor de bits entra para a meta surpresa ajudando a ficar mais perto de um surto se tornar realidade 👀 #CHUPAFLAVIA`
    );
  } else if (message === "comemora!") {    
    for (let i = 0; i < 3; i++) {
      twitch.action(
        target,
        `flavsf1Princesa flavsf1Princesa flavsf1Princesa A META FOI CONCLUÍDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA flavsf1Princesa flavsf1Princesa flavsf1Princesa`
      );
    }
  } else if (isMod && message.startsWith("addbits! ")) {
    const amount = parseInt(message.replace("addbits!", "").trim());
    dispatch({
      type: GOAL_UPDATE,
      bits: amount,
    });
    twitch.action(
      target,
      `A meta secreta atualizou para ${
        amount + goal.amount
      }/${total} flavsf1Princesa`
    );
  } else if (message === "metasecreta!") {
    twitch.action(
      target,
      `A meta secreta está em ${goal.amount}/${total} flavsf1Princesa`
    );
  } else if (message === "quaispistas!") {
    twitch.action(
      target,
      `As pistas que já sairam foram ${goal.tips
        .map((v) => v + 1)
        .join(", ")} flavsf1Princesa`
    );
  } else if (message.startsWith("repete! ")) {
    const tip = parseInt(message.replace("repete!", "").trim()) - 1;

    if (goal.tips.includes(tip)) {
      const selected = allTips.find((t) => t.index === tip);
      if (selected) {
        sayLongText({ twitch, target, text: selected.title });
      } else {
        twitch.action(target, `Pista não encontrada`);
      }
    } else {
      twitch.action(target, "Para de tentar roubar :(");
    }
  } else if (isMod && message.startsWith("pistaatualiza! ")) {
    let newTips = message
      .replace("pistaatualiza! ", "")
      .trim()
      .split(" ")
      .map((t) => parseInt(t) - 1);

    dispatch({
      type: GOAL_REPLACE,
      tips: newTips,
    });
  }
}

async function sayLongText({ twitch, target, text }) {
  const words = text.split(" ");
  let current = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (current.length + word.length >= 200) {
      twitch.say(target, current.trim()).then(console.log);
      await new Promise((resolve) => setTimeout(resolve, 100));
      current = "";
    }
    current += word + " ";
  }

  if (current) {
    twitch.say(target, current.trim());
  }
}

export default onCheerHandler;
