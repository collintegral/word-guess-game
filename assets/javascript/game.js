// First, create the game object with pertinent variables inside.

var hangman = {
    wincount: 0,
    losscount: 0,
    strikes: 0,
    maxstrikes: 7,
    userinput: "",
    wrongguesses: [],
    allguesses: [],
    currentword: "",
    hiddenword: "",
    inprogress: false,

    possiblewords: ["bandanna", "bronco", "buckaroo", "bushwacker", "campfire", "cattle", "cattledrive",
                    "corral", "cowboy", "cowgirl", "deputy", "desert", "frontier", "gallop", "horse", "horseshoe", 
                    "lasso", "livestock", "longhorn", "outhouse", "outlaw", "ranch", "rawhide", "revolver",
                    "rodeo", "rustler", "saddle", "saloon", "sheriff", "stallion", "stampede", "stockade",
                    "trainyard", "varmint", "vulture"],
    usedwords: [],

    selectWord: function() {
        // This function randomly selects an entry in the possiblewords array.
        // It then checks it against the usedwords array to make sure it isn't a repeat.
        // It will then pass the word on to currentword, set hiddenword's underscore count, and add it to usedwords.
        // Else, it will repeat the function until a new word is chosen.

        var tempWord = this.possiblewords[Math.floor(Math.random() * this.possiblewords.length)];
        if (this.usedwords.includes(tempWord) === false) {
            this.currentword = tempWord;
            for (var i = 0; i < this.currentword.length; i++) {
                this.hiddenword += "_";
            }
            this.usedwords.push(tempWord);
            if (this.usedwords.length === this.possiblewords.length) {
                this.usedwords = [];
            }
        }
        else {
            this.selectWord();
        }
        this.refreshBoard();
        this.inprogress = true;
    },

    takeInput: function(pressed) {
        // This function checks allguesses to see if an input has been entered already.
        // If it has been, ignore it.
        // If not, it adds it to allguesses and passes the keypress into the object's userinput variable.
        // Then run checkInput.
        if (this.inprogress === true) { 
            if (this.allguesses.includes(pressed) === false) {
                this.userinput = pressed;
                this.allguesses.push(this.userinput);
                this.checkInput();
            }
        }   
    },

    checkInput: function() {
        // This function takes the acquired userinput and compares it to the currentword's letters.
        // If it matches one, run correctGuess. If not, run wrongGuess.

        if (this.currentword.includes(this.userinput) === true) {
            this.correctGuess();
        }
        else {
            this.wrongGuess();
        }
    },
    
    correctGuess: function() {
        // This function replaces an underscore in hiddenword with the appropriate letter in currentword.
        // If hiddenword and currentword are equal, run gameWin.

        var holdHidden = this.hiddenword.split("");
        for (var i = 0; i < this.currentword.length; i++) {
            if (this.currentword[i] === this.userinput) {
               holdHidden[i] = this.userinput;
            }
        }
        this.hiddenword = holdHidden.join("");

        this.refreshBoard();

        if (this.hiddenword === this.currentword) {
            this.gameWin();
        }
    },

    wrongGuess: function() {
        // This function places the guessed letter in the wrongguesses array and adds a strike.
        // If strikes reach maximum, run gameLoss.

        this.wrongguesses.push(this.userinput);
        this.strikes++;
        this.refreshBoard();

        if (this.strikes === this.maxstrikes) {
            this.gameLoss();
        }
    },

    gameWin: function() {
        // This function congratulates the user and causes the game to stop taking inputs until a new one starts.

        this.wincount++;
        this.refreshBoard();
        $("#guesses").text("You've Won!");
        this.winSound();
        this.inprogress = false;
    },

    gameLoss: function() {
        // This function sympathizes with the user and stops taking inputs until a new game is started.

        this.losscount++;
        this.refreshBoard();
        $("#guesses").text("You've Lost!");
        this.lossSound();
        this.inprogress = false;
    },

    refreshBoard: function() {
        // This function will renew the board, updating all the pertinent information.
        
        $("#wins").text("Wins: " + this.wincount);
        $("#strikes").text("Guesses Left: " + (this.maxstrikes - this.strikes));
        $("#losses").text("Losses: " + this.losscount);
        $("#wordspace").text(this.hiddenword);
        $("#guesses").text(this.wrongguesses);
    },

    restartBoard: function() {
        // This function clears the allguesses, wrongguesses, and strikes, then runs selectWord.

        this.strikes = 0;
        this.maxstrikes = 7;
        this.userinput = "";
        this.wrongguesses = [];
        this.allguesses = [];
        this.currentword = "";
        this.hiddenword = "";

        
        this.selectWord();
    },

    resetBoard: function() {
        // This function resets all long-term variables to their default value, then runs restartBoard.
        this.wincount = 0;
        this.losscount = 0;
        this.usedwords = [];

        this.restartBoard();
        hangman.startSound();
    },

    startSound: function() {
        var sound = document.getElementById("sounds");
        sounds.src = "./assets/sounds/highnoon.mp3";
        sound.play();
    },
    winSound: function() {
        var sound = document.getElementById("sounds");
        sounds.src = "./assets/sounds/winquote.mp3";
        sound.play();
    },
    lossSound: function() {
        var sound = document.getElementById("sounds");
        sounds.src = "./assets/sounds/lossquote.mp3";
        sound.play();
    },
};

// Last, create the listener for a keystroke and any button presses. Only bother collecting while game is going.

document.onkeypress = function(letter) {
        hangman.takeInput(letter.key);
};

hangman.startSound();