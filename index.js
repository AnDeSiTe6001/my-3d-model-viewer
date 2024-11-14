/* output: bet */
const betchip = document.getElementById("betchip");
/* buttons */
const startgame = document.getElementById("startgame");
const Hit = document.getElementById("Hit");
const Stand = document.getElementById("Stand");
const Signal100 = document.getElementById("Signal100");

const Assigns = document.querySelectorAll('[id*="Assign"]');
//const Assign100 = document.getElementById("Assign100");
const nextRound = document.getElementById("nextRound");
/* output: card */
const dealerCard = document.querySelector("#dealer .card");
const playerCard = document.querySelector("#player .card");

/* output: point */
const dealerPointsOpt = document.querySelector("#dealer .point");
const playerPointsOpt = document.querySelector("#player .point");
/* output: player's chip */
const playerChip = document.querySelector("#player .chips");
/* output: game record */
const recordTable = document.getElementById("record");

const showresult = document.getElementById("showresult");

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];

let deck = [];

let playerRemainChip = 1000;
let playerPoints = 0;
let playerAce = 0;
let dealerPoints = 0;
let dealerAce = 0;
let betAmount = 0;
let round = 0;

let Hitdisabled;

function init() {
  Hitdisabled = true;

  startgame.disabled = true;
  Hit.disabled = Hitdisabled;
  Stand.disabled = true;
  Signal100.disabled = true;
  nextRound.disabled = true;
  Assigns.forEach((assign) => {
    assign.disabled = false;
  });

  //playerRemainChip = 1000;
  betAmount = 0;
  playerPoints = 0;
  dealerPoints = 0;
  playerAce = 0;
  dealerAce = 0;

  deck = [];
  betchip.innerHTML = "bet chip: " + betAmount;
  playerChip.innerHTML = "remain: " + playerRemainChip;
  dealerPointsOpt.innerHTML = `Point: ${dealerPoints}`;
  playerPointsOpt.innerHTML = `Point: ${playerPoints}`;
  dealerCard.innerHTML = "Dealer Random Card: ";
  playerCard.innerHTML = "Player Random Card: ";
  // Populate the deck with 52 unique cards
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(`${rank} of ${suit}`);
    }
  }
}
nextRound.onclick = function () {
  init();
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function getPoints(name, ch) {
  console.log("name = " + name);
  if (name == "Ace") {
    if (ch == "player") return 11;
    else return 1;
  } else if (name == "Jack" || name == "Queen" || name == "King") {
    return 10;
  } else {
    return parseInt(name);
  }
}

Assigns.forEach((button) => {
  let addChip = button.id.split("Assign")[1];

  let Allin = false;
  if (addChip != "All") {
    addChip = parseInt(addChip);
  } else {
    Allin = true;
  }
  console.log(addChip);

  button.onclick = function () {
    if (playerRemainChip - addChip >= 0 || Allin) {
      if (Allin) {
        betAmount += playerRemainChip;
        playerRemainChip = 0;
      } else {
        betAmount += addChip;
        playerRemainChip -= addChip;
      }
      playerChip.innerHTML = "remain: " + playerRemainChip;
      betchip.innerHTML = "bet chip: " + betAmount;
      startgame.disabled = false;
    }
  };
});

/*
Assign100.onclick = function () {
  if (playerRemainChip - 100 >= 0) {
    betAmount += 100;
    betchip.innerHTML = "bet chip: " + betAmount;
    playerRemainChip -= 100;
    playerChip.innerHTML = "remain: " + playerRemainChip;
    startgame.disabled = false;
  }
};*/

Signal100.onclick = function () {
  if (playerRemainChip - 100 >= 0) {
    betAmount += 100;
    betchip.innerHTML = "bet chip: " + betAmount;
    playerRemainChip -= 100;
    playerChip.innerHTML = "remain: " + playerRemainChip;
  }
};

function DealerDrawCard() {
  let randomIndex = Math.floor(Math.random() * (deck.length - 1));
  let randomCard = deck[randomIndex];
  if (randomCard.includes("Ace")) {
    dealerAce++;
  }
  dealerCard.innerHTML += ` | ${randomCard} |`;
  dealerPoints += getPoints(randomCard.split(" of ")[0], "dealer");
  dealerPointsOpt.innerHTML = `Point: ${dealerPoints}`;
  deck.splice(randomIndex, 1);
}

function PlayerDrawCard() {
  randomIndex = Math.floor(Math.random() * (deck.length - 1));
  randomCard = deck[randomIndex];
  if (randomCard.includes("Ace")) {
    playerAce++;
  }
  playerCard.innerHTML += ` | ${randomCard} |`;
  playerPoints += getPoints(randomCard.split(" of ")[0], "player");
  playerPointsOpt.innerHTML = `Point: ${playerPoints}`;
  deck.splice(randomIndex, 1);
}

startgame.onclick = function () {
  startgame.disabled = true;
  Hitdisabled = false;
  Hit.disabled = Hitdisabled;
  Stand.disabled = false;
  Signal100.disabled = false;

  Assigns.forEach((assign) => {
    assign.disabled = true;
  });
  //Assign100.disabled = true;

  // dealer
  DealerDrawCard();
  //player
  PlayerDrawCard();
};

function HitEvent() {
  PlayerDrawCard();

  if (playerPoints > 21) {
    if (playerAce > 0) {
      playerPoints -= 10;
      playerPointsOpt.innerHTML = `Point: ${playerPoints}`;
      playerAce--;
    } else {
      GameOver("lose");
      // game over
    }
  }
}

let holdTimeout;
let functionExecuted = false;
Hit.onclick = function () {
  HitEvent();
};

document.addEventListener("keydown", function (event) {
  if (event.key === "h" || (event.key === "H" && !holdTimeout)) {
    holdTimeout = setTimeout(() => {
      if (!functionExecuted && !Hitdisabled) HitEvent();
      functionExecuted = true;
    }, 3000);
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "h" || event.key === "H") {
    // Clear the timeout if the key is released before 3 seconds
    clearTimeout(holdTimeout);
    holdTimeout = null;
    functionExecuted = false;
  }
});

function GameOver(status) {
  console.log(`U ${status}!`);
  if (status == "win") {
    playerRemainChip += betAmount * 2;
  } else if (status == "draw") {
    playerRemainChip += betAmount;
  }
  startgame.disabled = true;
  Hitdisabled = true;
  Hit.disabled = Hitdisabled;
  Stand.disabled = true;
  Signal100.disabled = true;
  Assigns.forEach((assign) => {
    assign.disabled = true;
  });
  //Assign100.disabled = true;
  nextRound.disabled = false;

  const gameInfo = {
    PlayerCard: playerCard.innerHTML.toString(),
    DealerCard: dealerCard.innerHTML.toString(),
    bet: betAmount,
    status: status,
  };
  sessionStorage.setItem("Round" + round, JSON.stringify(gameInfo));
  localStorage.setItem("Round" + round, JSON.stringify(gameInfo));
  RecordTableUpdate();
  round++;
}

StandEvent = function () {
  while (dealerPoints < 17) {
    DealerDrawCard();
  }
  if (dealerPoints > 21) {
    GameOver("win");
  } else {
    if (playerPoints > dealerPoints) {
      GameOver("win");
    } else if (playerPoints == dealerPoints) {
      GameOver("draw");
    } else {
      GameOver("lose");
    }
  }
};

Stand.onclick = function () {
  StandEvent();
};

document.addEventListener("keydown", function (event) {
  if (event.key === "s" || (event.key === "S" && !holdTimeout)) {
    holdTimeout = setTimeout(() => {
      if (!functionExecuted && !Hitdisabled) StandEvent();
      functionExecuted = true;
    }, 3000);
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "s" || event.key === "S") {
    // Clear the timeout if the key is released before 3 seconds
    clearTimeout(holdTimeout);
    holdTimeout = null;
    functionExecuted = false;
  }
});

function RecordTableUpdate() {
  const row = document.createElement("tr");

  const pc = document.createElement("td");
  const dc = document.createElement("td");
  const bet = document.createElement("td");
  const status = document.createElement("td");

  const savedGameInfoSession = JSON.parse(
    localStorage.getItem("Round" + round)
  );
  console.log(savedGameInfoSession.PlayerCard);
  pc.innerHTML = savedGameInfoSession.PlayerCard;
  dc.innerHTML = savedGameInfoSession.DealerCard;
  bet.innerHTML = savedGameInfoSession.bet;
  status.innerHTML = savedGameInfoSession.status;

  row.appendChild(pc);
  row.appendChild(dc);
  row.appendChild(bet);
  row.appendChild(status);
  recordTable.appendChild(row);
}
