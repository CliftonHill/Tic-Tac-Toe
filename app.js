// Author: Clifton Hill
// Inspiration: https://www.youtube.com/watch?v=TD5EaIkhSTQ
// Code is my own, I watched the video, took notes, then made my own independent attempt. jQuery was added later, so not all DOM selections are made with jQuery.
//Features: switches turns on even games to computer
// levels of difficulty
//mobile ready

//Later:
// add some sound effects
//clean up code.
//Can't fix offset, .col shifts from 264px from the top to 271 when a click is made on .cell. I tried to set the offset manually in css by pixel to keep this from changing, but it didn't help. Also, trying to input code in the click portion of js below didn't help.

//Setup
let turn,
  gamesPlayed = 0,
  humanScore = 0,
  computerScore = 0,
  winner,
  winningPlayer,
  difficulty,
  gameInProgress = false;
let allCells = document.querySelectorAll(".cell");
let playableCells;
let winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
  ]

//Constructor
function Game(){
    this.start = function() {
      turn = 0;
      gameInProgress = true;
      allCells.forEach(function(element) {
        element.innerText = " "; //board is cleared
        element.classList.add("playable");
      });
      document.querySelector(".start").removeEventListener("click", game.start);
      document.querySelector(".nav-start").style.visibility = "hidden";
      document.querySelector(".nav h2").style.visibility = "hidden";
      difficulty = document.getElementById("difficulty").value;
      $(".cell").removeClass("glow");
      $(".human, .computer").removeClass("alert");

      // alternate game start between computer and human
      if (gamesPlayed % 2 === 1) {
          ++turn;
      }
      return game.nextTurn();
    }
    // alternate turns
    this.nextTurn = function() {
      if (turn % 2 === 0 ) {
        return humanPlayer();
      } else {
        return computerPlayer();
      }
    }
  }

let game = new Game();
document.querySelector(".start").addEventListener("click", game.start);

// in Game code
function isPlayable() {
   playableCells = document.querySelectorAll(".playable");
}


function humanPlayer () {
    console.log("**human play");
    isPlayable();
    playableCells.forEach(function(element) {
      element.addEventListener("click", humanPlayed);
    });

    function humanPlayed() {
      this.innerText = "x";
      this.classList.remove("playable");
      playableCells.forEach(function(el){
        el.removeEventListener("click", humanPlayed);
      });
      return isWin("x");
    }
}

function computerPlayer () {
    console.log("**computer play");
    let counter;
    let openSpace
    let openSpaceIndex;

    // Medium Difficulty
  if (difficulty === "medium" || difficulty === "hard") {
    let marksArray = Array.from(allCells, function(e) {return e.innerText});

    for (let currCombo = 0; currCombo < winningCombos.length; currCombo++) {
      counter = 0;
      openSpace = false;

      for (let i = 0, comboIndex = winningCombos[currCombo]; i < 3; i++ ) {
        // if o increase counter, and if no x, then check if at least 2 counted, and fill in 3rd to win
        if (marksArray[comboIndex[i]] !== "x" && marksArray[comboIndex[i]] !== "o") {
          openSpace = true;
          openSpaceIndex = comboIndex[i];
        }
        if (marksArray[comboIndex[i]] === "o") {
          ++counter;
        }
        if (counter === 2 && openSpace === true) {
          allCells[openSpaceIndex].innerText = "o";
          allCells[openSpaceIndex].classList.remove("playable");
          return isWin("o");
        }
      }
    } //end of loop
  }

  // Hard Difficulty
  if (difficulty === "hard") {
    // input - look to block x if 2
    let marksArray = Array.from(allCells, function(e) {return e.innerText});

    for (let currCombo = 0; currCombo < winningCombos.length; currCombo++) {
      counter = 0;
      openSpace = false;

      for (let i = 0, comboIndex = winningCombos[currCombo]; i < 3; i++ ) {
        // if 2 x's in a row, and an openspace, then fill in open space to block
        if (marksArray[comboIndex[i]] !== "x" && marksArray[comboIndex[i]] !== "o") {
          openSpace = true;
          openSpaceIndex = comboIndex[i];
        }
        if (marksArray[comboIndex[i]] === "x") {
          ++counter;
        }
        if (counter === 2 && openSpace === true) {
          allCells[openSpaceIndex].innerText = "o";
          allCells[openSpaceIndex].classList.remove("playable");
          return isWin("o");
        }
      }
    } //end of loop
  }

  // Easy difficulty - randomly plays in available space, still used for med/hard if no other advantageous play is available.
    isPlayable();
    let computerPlay = Math.floor(Math.random() * playableCells.length);
    playableCells[computerPlay].innerText = "o";
    playableCells[computerPlay].classList.remove("playable");
    return isWin("o")
}

// end game when someone wins
function isWin(marker) {
  let marksArray = Array.from(allCells, function(e) {return e.innerText});
  isPlayable();

  winningCombos.forEach(function(currCombo){ // call stack exceeded when playing Medium, and computer has a winningcombo with 2. I think this is due to functions taking too long to run through and computer jumps ahead before a return process is enacted, so maybe async/await would help. I tried cleaning up code with returns to get out of the functions, but it was not enough. Also when this occurs, there is a hang as call stack runs and computer often/not always selects multiple spaces. Resolved by removing some foreach loops that appeared to continue looping past when needed to stop.
       let counter = 0;

       currCombo.forEach(function(subElement){
         if (marksArray[subElement] === marker) {
           ++counter;
           if (counter === 3) { //winning condition
             winner = marksArray[currCombo[0]];
             gameInProgress = false;
             gamesPlayed++;
             // pulse effect for winning combo
             $(allCells[currCombo[0]]).addClass("glow");
             $(allCells[currCombo[1]]).addClass("glow");
             $(allCells[currCombo[2]]).addClass("glow");
             $(".glow").fadeOut(0).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
             
             if (winner === "x") {
               console.log("Human wins");
               gameInProgress = false;
               winningPlayer = "You Win! ";
               document.querySelector(".human .points").innerText = ++humanScore;
               $(".human").addClass("alert").fadeIn(600);
               return playAgain();
             } else if (winner === "o") {
               console.log("Computer wins");
               gameInProgress = false;
               winningPlayer = "Computer Wins. "
               document.querySelector(".computer .points").innerText = ++computerScore;
               $(".computer").addClass("alert").fadeIn(600);
               return playAgain();
             }
           }
         }
       });
    });

if (gameInProgress) {
  setTimeout(function(){
    if (playableCells.length === 0) { //no win
        gameInProgress = false;
        winningPlayer = "Draw. ";
        return playAgain();
      } else if (gameInProgress) {
        ++turn;
        return game.nextTurn();
      }
  }, 0200);
}
}

function playAgain(){
  console.log("Play again?");
  $(".playable").removeClass("playable");
  document.querySelector(".start").addEventListener("click", game.start);
  document.querySelector(".nav-start").style.visibility = "visible";
  document.querySelector(".nav h2").innerHTML = winningPlayer + "<br>Play Again?";
  document.querySelector(".nav h2").style.visibility = "visible";
  $(".nav h2").animate({"font-size": "2.0rem"},).animate({"font-size": "1.7rem"},);
}
