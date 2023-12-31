// this project is a spin slot machine for betting
// user inerts ammount and betsbon the number of winning lines
// if they are correct, theywin, and lose if not

const { count } = require('console');

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 9,
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 1,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt('Enter deposit amount: ');
    const numDepositAmount = parseFloat(depositAmount);

    if (isNaN(numDepositAmount) || numDepositAmount <= 0) {
      console.log('Invalid deposit amount, please try again');
    } else {
      return numDepositAmount;
    }
  }
};

//collect the number of lines they wanna bet on

const getNumberOfLines = () => {
  while (true) {
    const numberOfLines = prompt('Enter number Of Lines to bet on: ');
    const numNumberOfLines = parseFloat(numberOfLines);

    if (
      isNaN(numNumberOfLines) ||
      numNumberOfLines <= 0 ||
      numNumberOfLines > 3
    ) {
      console.log('Invalid number of lines, please try again');
    } else {
      return numNumberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt('Enter amount to bet on per line: ');
    const numBet = parseFloat(bet);

    if (isNaN(numBet) || numBet <= 0 || numBet > balance / lines) {
      console.log('Invalid amount, please try again');
    } else {
      return numBet;
    }
  }
};

// FUNCTION THAT SPINS THE MACHINE

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i <= count; i++) {
      symbols.push(symbol);
    }
  }
  //console.log(symbols);

  // generate symbols and put them in the array, eache array represents a column

  const reels = [];

  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

// NOW CHECKING IF THE USER WON,
//1. well transpoe the matrices to see exactly how it shows on thw slot machine

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = '';

    for (const [i, symbol] of row.entries()) {
      rowString += symbol;

      if (i != rows.length - 1) {
        rowString += ' | ';
      }
    }

    console.log(rowString);
  }
};

//2. Now determining the win

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log('***************** You have a balance of $' + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    // lets see how much the winnings are
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log('YOU WON, $' + winnings.toString());

    if (balance <= 0) {
      console.log('You ran out of money ');
      break;
    }

    const playAgain = prompt('Do you want to play again? (y/n)');
    if (playAgain != 'y') break;
  }
};
game();
