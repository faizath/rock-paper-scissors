var s = (elem) => {
    return document.querySelector(elem);
};
var a = (elem) => {
    return document.querySelectorAll(elem);
};

const theme = localStorage.theme;
if (theme != null && theme != "") {
  if (theme == "light") {
    s("html").className = "theme_light";
  } else if (theme == "dark") {
    s("html").className = "theme_dark";
    s("#darkMode").checked = true;
    s("#darkMode").dataset.toggled = "true";
  }
} else {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches == true) {
    localStorage.theme = "dark";
    s("html").className = "theme_dark";
    s("#darkMode").checked = true;
    s("#darkMode").dataset.toggled = "true";
  } else {
    localStorage.theme = "light";
    s("html").className = "theme_light";
  }
}

const isJSON = (json) => {
    try {
        JSON.parse(json);
        return true;
    } catch {
        return false;
    }
};

const newScoreLog = () => {
    localStorage.scoreLog = JSON.stringify({"player":0,"bot":0});
};
if (!localStorage.gameLog || !isJSON(localStorage.gameLog)) {
    localStorage.gameLog = "[]";
}
if (!localStorage.roundLog || !isJSON(localStorage.roundLog)) {
    localStorage.roundLog = "[]";
}
if (!localStorage.scoreLog || !isJSON(localStorage.scoreLog)) {
    newScoreLog();
}

const checkQuantity = () => {
    if (s("#quantity").value == 0) {
        s("#zeroReference").classList.remove('hidden');
    } else {
        s("#zeroReference").classList.add('hidden');
    }
};

s(".sub").onclick = () => {
    if (s("#quantity").value == 0) {
        s("#counter").classList.add('shakeContainer');
    } else {
        s("#quantity").value--;
        checkQuantity();
    }
};

s(".add").onclick = () => {
    s("#quantity").value++;
    checkQuantity();
};

s("#counter").onanimationend = (e) => {
    if (e.animationName === 'shakerightleft') {
        s("#counter").classList.remove('shakeContainer');
    }
};

const setDarkModeToggle  = () => {
    if (s("#darkMode").checked == true) {
        localStorage.theme = "dark";
        s("html").className = "theme_dark";
        s("#darkMode").dataset.toggled = "true";
    } else if (s("#darkMode").checked == false) {
        localStorage.theme = "light";
        s("html").className = "theme_light";
        s("#darkMode").dataset.toggled = "false";
    }
};

s("#darkMode").onchange = setDarkModeToggle;

var indexStart = 0, indexEnd = 10, txtStart = 1, txtEnd = 10;
const updateGameLog = (txtStartDisabled=false,txtEndDisabled=false) => {
    var tableHeader = "<tr><th>No</th><th>Date</th><th>Player</th><th>Bot</th><th>Result</th></tr>";
    var tableContents = "";
    const gameLog = JSON.parse(localStorage.gameLog);
    const roundsLog = JSON.parse(localStorage.gameLog).slice(indexStart,indexEnd);
    if (gameLog.length < 10) {
        txtEnd = gameLog.length;
    }
    for (i in roundsLog) {
        tableContents += `<tr><td><a href="javascript:;" class="roundHistory">${roundsLog[i].no}</a></td><td>${roundsLog[i].date}</td><td>${roundsLog[i].player}</td><td>${roundsLog[i].bot}</td><td>${roundsLog[i].result}</td></tr>`;
    }
    tableContents += gameLog.length ? `<tr><td colspan='5'><button class='button button-danger' id='delHistory'>Delete History</button><button id='btnPrev' class='button button-secondary'${txtStartDisabled ? "disabled" : ""}><</button><button id='btnNext' class='button button-secondary'${txtEndDisabled ? "disabled" : ""}>></button><label class='txt inline-center pl-5'><span class='pl-5'>${txtStart}</span>&nbsp;-&nbsp;<span>${txtEnd} </span><span>of total ${gameLog.length} game${gameLog.length > 1 ? "s" : ""}</span></label></td><tr>` : "<tr><td colspan='5'><p>No data found</p></td><tr>";
    s("table").innerHTML = tableHeader + tableContents;
    if (s("#btnPrev") && s("#btnNext")) {
        s("#btnPrev").onclick = () => {
            indexStart -= 10;
            indexEnd -= 10;
            txtStart = indexStart + 1;
            txtEnd = indexEnd;
            updateGameLog(indexStart == 0 ? true : false);
        };
        s("#btnNext").onclick = () => {
            indexStart += 10;
            indexEnd += 10;
            txtStart = indexStart + 1;
            if (indexEnd >= gameLog.length) {
                txtEnd = gameLog.length;
                updateGameLog(false,true);
            } else {
                txtEnd = indexEnd;
                updateGameLog();
            }
        };
        s("#delHistory").onclick = () => {
            indexStart = 0, indexEnd = 10, txtStart = 1, txtEnd = 10;
            localStorage.gameLog = "[]";
            localStorage.roundLog = "[]";
            updateGameLog();
        };
        [].forEach.call(a("a.roundHistory"), function(elem) {
            elem.onmouseover = () => {
                elem.parentNode.style = "background-color: yellow; transition: 0.5s;";
                elem.style = "color: black;";
            };
            elem.onmouseout = () => {
                elem.parentNode.style = "transition: 0.5s";
                elem.style.color = "";
            };
            elem.onclick = () => {
                s("h2").innerText = `Round History: Game ${elem.innerText}`;
                updateRoundLog(parseInt(elem.innerText),true,JSON.parse(localStorage.roundLog)[parseInt(elem.innerText) - 1].length < 10 ? true : false);
            };
        });
    }
};
updateGameLog(true,JSON.parse(localStorage.gameLog).length > 10 ? false : true);

var roundIndexStart = 0, roundIndexEnd = 10, roundTxtStart = 1, roundTxtEnd = 10;
const updateRoundLog = (round,txtStartDisabled=false,txtEndDisabled=false) => {
    var tableHeader = "<tr><th>No</th><th>Date</th><th>Player</th><th>Bot</th><th>Result</th></tr>";
    var tableContents = "";
    const roundLog = JSON.parse(localStorage.roundLog)[round - 1];
    const roundsLog = JSON.parse(localStorage.roundLog)[round - 1].slice(roundIndexStart,roundIndexEnd);
    if (roundLog.length < 10) {
        roundTxtEnd = roundLog.length;
    }
    for (i in roundsLog) {
        tableContents += `<tr><td>${roundsLog[i].no}</td><td>${roundsLog[i].date}</td><td>${roundsLog[i].player}</td><td>${roundsLog[i].bot}</td><td>${roundsLog[i].result}</td></tr>`;
    }
    tableContents += roundLog.length ? `<tr><td colspan='5'><button class='button button-primary' id='back'>Back</button><button id='btnRoundPrev' class='button button-secondary'${txtStartDisabled ? "disabled" : ""}><</button><button id='btnRoundnext' class='button button-secondary'${txtEndDisabled ? "disabled" : ""}>></button><label class='txt inline-center pl-5'><span class='pl-5'>${roundTxtStart}</span>&nbsp;-&nbsp;<span>${roundTxtEnd} </span><span>of total ${roundLog.length} round${roundLog.length > 1 ? "s" : ""}</span></label></td><tr>` : "<tr><td colspan='5'><p>No data found</p></td><tr>";
    s("table").innerHTML = tableHeader + tableContents;
    if (s("#btnRoundPrev") && s("#btnRoundnext")) {
        s("#btnRoundPrev").onclick = () => {
            roundIndexStart -= 10;
            roundIndexEnd -= 10;
            roundTxtStart = roundIndexStart + 1;
            roundTxtEnd = roundIndexEnd;
            updateRoundLog(round,roundIndexStart == 0 ? true : false);
        };
        s("#btnRoundnext").onclick = () => {
            roundIndexStart += 10;
            roundIndexEnd += 10;
            roundTxtStart = roundIndexStart + 1;
            if (roundIndexEnd >= roundLog.length) {
                roundTxtEnd = roundLog.length;
                updateRoundLog(round,false,true);
            } else {
                roundTxtEnd = roundIndexEnd;
                updateRoundLog(round);
            }
        };
        s("#back").onclick = () => {
            roundIndexStart = 0, roundIndexEnd = 10, roundTxtStart = 1, roundTxtEnd = 10;
            s("h2").innerText = "Game History";
            updateGameLog(indexStart == 00 ? true : false,JSON.parse(localStorage.gameLog).length == txtEnd ? true : false);
        };
    }
};

const addGameLog = (newGameLog) => {
    var logUpdate = JSON.parse(localStorage.gameLog);
    if (logUpdate.length == 0) {
        newGameLog.no = 1;
    } else {
        newGameLog.no = logUpdate.slice(-1)[0].no + 1;
    }
    logUpdate[logUpdate.length] = newGameLog;
    localStorage.gameLog = JSON.stringify(logUpdate);
    newScoreLog();
};

const addRoundLog = (newRoundLog) => {
    var logUpdate = JSON.parse(localStorage.roundLog);
    if (!logUpdate[JSON.parse(localStorage.gameLog).length]) {
        logUpdate[logUpdate.length] = [];
    }
    if (logUpdate.slice(-1)[0].length == 0) {
        newRoundLog.no = 1;
    } else {
        newRoundLog.no = logUpdate.slice(-1)[0].slice(-1)[0].no + 1;
    }
    logUpdate.slice(-1)[0][logUpdate.slice(-1)[0].length] = newRoundLog;
    localStorage.roundLog = JSON.stringify(logUpdate);
};

s("#start").onclick = () => {
    if (s("#quantity").value < 0) {
        s("#counter").classList.add('shakeContainer');
    } else {
        indexStart = 0, indexEnd = 10, txtStart = 1, txtEnd = 10;
        roundIndexStart = 0, roundIndexEnd = 10, roundTxtStart = 1, roundTxtEnd = 10;
        s("h2").innerText = "Game History";
        updateGameLog(true,JSON.parse(localStorage.gameLog).length > 10 ? false : true);
        s("#splashScreen").className = "fadeout";
        s(".splashScreen").style.width = "0";
        s("#quantity").disabled = "true";
        s("#mainDarkModeContainer").innerHTML = s("#splashDarkModeContainer").innerHTML;
        s("#splashDarkModeContainer").removeChild(s("#splashDarkModeContainer").children[0]);
        if (s("#darkMode").dataset.toggled == "true") {
            s("#darkMode").checked = true;
        }
        s("#darkMode").onchange = setDarkModeToggle;
        if (s("#quantity").value == 0) {
            s("#end").classList.remove("hidden");
            s("#end").removeAttribute("disabled");
            s("#quantity").dataset.infinity = true;
            s("#roundLeft").innerHTML = "&infin;";
        } else {
            if (s("#end").className.search("hidden") < 0) {
                s("#end").classList.add("hidden");
            }
            s("#quantity").dataset.infinity = false;
            s("#roundLeft").innerText = s("#quantity").value;
        }
        for (i = 0; i < a("button.action").length; i++) {
            a("button.action")[i].removeAttribute("disabled");
        }
        s("#menu").innerText = "Menu";
    }
};

s("#source").onclick = () => {
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://github.com/faizath/rock-paper-scissors"
    a.click();
};

s("#menu").onclick = (e) => {
    updateGameLog(true,JSON.parse(localStorage.gameLog).length > 10 ? false : true);
    s("#splashScreen").className = "fadein";
    s("#quantity").removeAttribute("disabled");
    s("#quantity").value = encodeURIComponent(s("#roundLeft").innerText) == "%E2%88%9E" ? 0 : s("#roundLeft").innerText;
    s("#splashDarkModeContainer").innerHTML = s("#mainDarkModeContainer").innerHTML;
    s("#mainDarkModeContainer").removeChild(s("#mainDarkModeContainer").children[0]);
    if (s("#darkMode").dataset.toggled == "true") {
        s("#darkMode").checked = true;
    }
    s("#darkMode").onchange = setDarkModeToggle;
    s("#stats").removeAttribute("style");
    s(".splashScreen").style.width = "100%";
    checkQuantity();
    if (e.srcElement.innerText == "Restart") {
        s("#start").innerText = "Start";
        s("#stats").innerText = "";
        s("#botScore").innerText = 0;
        s("#playerScore").innerText = 0;
    } else {
        s("#start").innerText = "Continue";
    }
};

const Restart  = () => {
    for (i = 0; i < a("button.action").length; i++) {
        a("button.action")[i].disabled = true;
    }
    if (parseInt(s("#playerScore").innerText) == parseInt(s("#botScore").innerText)) {
        s("#stats").style.color = "gold";
        s("#stats").innerText = "Tied Game";
        s("#stats").classList.add("animate");
    } else if (parseInt(s("#playerScore").innerText) > parseInt(s("#botScore").innerText)) {
        s("#stats").style.color = "gold";
        s("#stats").innerText = "Player wins the game";
        s("#stats").classList.add("animate");
    } else if (parseInt(s("#playerScore").innerText) < parseInt(s("#botScore").innerText)) {
        s("#stats").style.color = "gold";
        s("#stats").innerText = "Bot wins the game";
        s("#stats").classList.add("animate");
    }
    s("#menu").innerText = "Restart";
    var scoreLog = JSON.parse(localStorage.scoreLog);
    if (scoreLog.player > scoreLog.bot) {
        var result = "Player wins the game";
    } else if (scoreLog.player < scoreLog.bot) {
        var result = "Bot wins the game";
    } else {
        var result = "Tied game";
    }
    var gameLog = {"date":new Date().toString().split(" ").slice(0,-1).join(" "),"player":scoreLog.player,"bot":scoreLog.bot,"result":result}
    addGameLog(gameLog);
};

s("#end").onclick = (e) => {
    Restart();
    s("#roundLeft").innerText = 0;
    e.srcElement.disabled = "true";
};

[].forEach.call(a("button.action"), function(elem) {
    elem.onclick = function() {
        if (!(s("#roundLeft").innerText == 0 && s("#quantity").dataset.infinity == "false")) {
            var botAction = ["Rock","Paper","Scissors"][Math.floor(Math.random()*3)];
            var roundLog = {"date":new Date().toString().split(" ").slice(0,-1).join(" "),"player":"","bot":"","result":""}
            if (this.innerText == botAction) {
                roundLog.player = roundLog.bot = botAction;
                s("#stats").innerText = roundLog.result = "Tied Round";
            } else if (this.innerText == "Rock") {
                roundLog.player = "Rock";
                if (botAction == "Paper") {
                    roundLog.bot = "Paper";
                    localStorage.scoreLog = JSON.stringify((()=>{var scoreLog = JSON.parse(localStorage.scoreLog);scoreLog.bot++;return scoreLog})());
                    s("#botScore").innerText = parseInt(s("#botScore").innerText) + 1;
                    s("#stats").innerText = roundLog.result = "Bot wins this round";
                } else if (botAction == "Scissors") {
                    roundLog.bot = "Scissors";
                    localStorage.scoreLog = JSON.stringify((()=>{var scoreLog = JSON.parse(localStorage.scoreLog);scoreLog.player++;return scoreLog})());
                    s("#playerScore").innerText = parseInt(s("#playerScore").innerText) + 1;
                    s("#stats").innerText = roundLog.result = "Player wins this round";
                }
            } else if (this.innerText == "Paper") {
                roundLog.player = "Paper";
                if (botAction == "Rock") {
                    roundLog.bot = "Rock";
                    localStorage.scoreLog = JSON.stringify((()=>{var scoreLog = JSON.parse(localStorage.scoreLog);scoreLog.player++;return scoreLog})());
                    s("#playerScore").innerText = parseInt(s("#playerScore").innerText) + 1;
                    s("#stats").innerText = roundLog.result = "Player wins this round";
                } else if (botAction == "Scissors") {
                    roundLog.bot = "Scissors";
                    localStorage.scoreLog = JSON.stringify((()=>{var scoreLog = JSON.parse(localStorage.scoreLog);scoreLog.bot++;return scoreLog})());
                    s("#botScore").innerText = parseInt(s("#botScore").innerText) + 1;
                    s("#stats").innerText = roundLog.result = "Bot wins this round";
                }
            } else if (this.innerText == "Scissors") {
                roundLog.player = "Scissors";
                if (botAction == "Paper") {
                    roundLog.bot = "Paper";
                    localStorage.scoreLog = JSON.stringify((()=>{var scoreLog = JSON.parse(localStorage.scoreLog);scoreLog.player++;return scoreLog})());
                    s("#playerScore").innerText = parseInt(s("#playerScore").innerText) + 1;
                    s("#stats").innerText = roundLog.result = "Player wins this round";
                } else if (botAction == "Rock") {
                    roundLog.bot = "Rock";
                    localStorage.scoreLog = JSON.stringify((()=>{var scoreLog = JSON.parse(localStorage.scoreLog);scoreLog.bot++;return scoreLog})());
                    s("#botScore").innerText = parseInt(s("#botScore").innerText) + 1;
                    s("#stats").innerText = roundLog.result = "Bot wins this round";
                }
            }
            s("#stats").classList.add("animate");
            addRoundLog(roundLog);
            s("#roundLeft").innerHTML = s("#quantity").dataset.infinity == "false" ? parseInt(s("#roundLeft").innerText) - 1 : "&infin;";
        }
        if (s("#roundLeft").innerText == 0 && s("#quantity").dataset.infinity == "false") {
            Restart();
        }
    };
});

s("#stats").onanimationend = (e) => {
    if (e.animationName === 'blinking') {
        s("#stats").classList.remove('animate');
    }
};