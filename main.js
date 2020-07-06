let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;
let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
}

var settings = {
    corBg: "",
    corSnake: "",
    corFood: "",
    speed: 100,
}

var score = 0;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

var eat = new sound("sounds/eat.m4a");
var GameOver = new sound("sounds/game-over.m4a");
var soundtrack = new sound("sounds/background.mp3");

document.getElementById("settingsMenu").addEventListener("click", settingsMenu);
    
function settingsMenu(event){

    settings.sound = prompt('Deseja retirar o som? [S/N]');
    if(settings.sound === 'S') soundtrack.stop();

    settings.corBg = prompt("Digite o código HEX da cor desejada para o Background (Caso não deseje personalizar, pressione ENTER):").toString();

    settings.corSnake = prompt("Digite o código HEX da cor desejada para a Cobrinha (Caso não deseje personalizar, pressione ENTER):").toString();

    settings.corFood = prompt("Digite o código HEX da cor desejada para a Comida (Caso não deseje personalizar, pressione ENTER):").toString();

    var spdoption = (prompt("Digite a velocidade 1 - 3:"));
    if(spdoption){
    settings.speed = 150/spdoption;
    }

    return settings;
};


let food = {
    x: Math.floor(Math.random() * 14 + 1) * box,
    y: Math.floor(Math.random() * 14 + 1) * box,
}

let direction = "up";

function criarBG(){
    context.fillStyle = settings.corBg ? settings.corBg.toString() : "#048BA8";
    context.fillRect(0, 0, 15 * box, 15 * box);
}

function criarSnake(){
    for(i = 0 ; i < snake.length ; i++){
        context.fillStyle = settings.corSnake || "#E6E18F";
        context.fillRect(snake[i].x, snake[i].y, box, box)
    }
}

function drawFood(){
    context.fillStyle = settings.corFood || "#D34E24";
    context.fillRect(food.x, food.y, box, box);
}

document.addEventListener("keydown", update);

function update(event){
    if(event.keyCode == 37 && direction != "right") direction = "left";
    if(event.keyCode == 40 && direction != "down") direction = "up";
    if(event.keyCode == 39 && direction != "left") direction = "right";
    if(event.keyCode == 38 && direction != "up") direction = "down";
}

function iniciarJogo(){

    soundtrack.play();
    
    if(snake[0].x > 13 * box && direction == "right") snake[0].x = 0;
    if(snake[0].x < 1 && direction == "left") snake[0].x = 15 * box;

    if(snake[0].y > 13 * box && direction =="up") snake[0].y = 0;
    if(snake[0].y < 1 && direction == "down") snake[0].y = 15 * box;

    for(let i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            clearInterval(jogo);
            GameOver.play();
            alert("GAME OVER. Recarregue para jogar novamente");
        }
    }

    console.log(settings);

    criarBG();
    criarSnake();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY += box;
    if(direction == "down") snakeY -= box;

    if(snakeX != food.x || snakeY != food.y){
        snake.pop();
    }
    else{
        score += 1;
        eat.play();
        food.x = Math.floor(Math.random() * 14 + 1) * box;
        food.y = Math.floor(Math.random() * 14 + 1) * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    snake.unshift(newHead);
    document.getElementById("score").innerHTML = `Score: ${score}.`
}

let jogo = setInterval(iniciarJogo, settings.speed ? settings.speed : 100);
