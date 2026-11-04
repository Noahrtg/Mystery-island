
const width = 9;
const height = 7;

const obstacles = [
    [0,3], [1,3], [2,3],
    [3,1], [4,1], [5,3],
    [3,7], [4,7], [6,4]
];

const treasures = [
    {x:2,y:1, question:"Combien font 5 + 7 ?", answer:"12"},
    {x:6,y:3, question:"Je suis jaune et brille dans le ciel. Qui suis-je ?", answer:"soleil"},
    {x:1,y:5, question:"Combien de côtés possède un triangle ?", answer:"3"},
    {x:7,y:2, question:"Quel animal miaule ?", answer:"chat"},
    {x:6,y:5, question:"Combien font 10 x 2 ?", answer:"20"}
];

let player = {x:0,y:0};
let collected = [];
let points = 0;
let currentTreasure = null;
let finished = false;

const game = document.getElementById("game");

function render() {
    game.innerHTML = "";

    for(let y=0; y<height; y++) {
        for(let x=0; x<width; x++) {

            const tile = document.createElement("div");
            tile.className = "tile";

            const obstacle = obstacles.some(
                p => p[0]===x && p[1]===y
            );

            const treasureIndex = treasures.findIndex(
                t => t.x===x && t.y===y
            );

            if(player.x===x && player.y===y) {
                tile.classList.add("player");
                tile.textContent = "🧑";
            }
            else if(obstacle) {
                tile.classList.add("tree");
                tile.textContent = "🌳";
            }
            else if(treasureIndex !== -1 &&
                    !collected.includes(treasureIndex)) {
                tile.classList.add("treasure");
                tile.textContent = "💎";
            }
            else if(x===8 && y===6) {
                tile.textContent = collected.length===5 ? "🔓" : "🔒";
                tile.classList.add("rock");
            }
            else {
                tile.textContent = "🌿";
            }

            game.appendChild(tile);
        }
    }

    document.getElementById("score").textContent = collected.length;
    document.getElementById("points").textContent = points;
}

function move(dx,dy) {
    if(finished || currentTreasure !== null) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    if(nx<0 || nx>=width || ny<0 || ny>=height) return;

    const blocked = obstacles.some(
        p => p[0]===nx && p[1]===ny
    );

    if(blocked) {
        showMessage("🌳 Un arbre bloque ton chemin !");
        return;
    }

    player.x = nx;
    player.y = ny;

    const index = treasures.findIndex(
        t => t.x===nx && t.y===ny
    );

    if(index !== -1 && !collected.includes(index)) {
        currentTreasure = index;

        document.getElementById("question").textContent =
            treasures[index].question;

        document.getElementById("answer").value = "";
        document.getElementById("feedback").textContent = "";
        document.getElementById("modal").style.display = "flex";
        document.getElementById("answer").focus();
    }

    if(nx===8 && ny===6) {
        if(collected.length===5) {
            win();
        } else {
            showMessage("🔒 Trouve les 5 trésors pour ouvrir le coffre !");
        }
    }

    render();
}

function checkAnswer() {
    if(currentTreasure === null) return;

    const answer = document.getElementById("answer")
        .value.trim().toLowerCase();

    const correct = treasures[currentTreasure].answer;

    if(answer === correct) {
        collected.push(currentTreasure);
        points += 100;

        document.getElementById("modal").style.display = "none";
        currentTreasure = null;

        showMessage("🎉 Bravo ! Tu as trouvé un trésor : +100 points !");
        render();
    } else {
        document.getElementById("feedback").textContent =
            "❌ Mauvaise réponse. Essaie encore !";
    }
}

function showMessage(text) {
    document.getElementById("message").textContent = text;
}

function win() {
    finished = true;
    points += 500;

    document.getElementById("points").textContent = points;

    showMessage("🏆 FÉLICITATIONS ! Tu as trouvé le trésor légendaire !");
    render();
}

function restart() {
    player = {x:0,y:0};
    collected = [];
    points = 0;
    currentTreasure = null;
    finished = false;

    document.getElementById("modal").style.display = "none";

    showMessage("Nouvelle aventure ! Bonne chance !");
    render();
}

// Déplacement avec le clavier
document.addEventListener("keydown", function(e) {

    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    if(e.key==="ArrowUp" || e.key==="w") move(0,-1);
    if(e.key==="ArrowDown" || e.key==="s") move(0,1);
    if(e.key==="ArrowLeft" || e.key==="a") move(-1,0);
    if(e.key==="ArrowRight" || e.key==="d") move(1,0);

    if(e.key==="Enter" && currentTreasure !== null) {
        checkAnswer();
    }
});

// Lancement du jeu
render();
