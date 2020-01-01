import * as PIXI from "pixi.js";
import BlueBall from "@app/BlueBall";
import RedBall from "@app/RedBall";
import {areBallsColliding} from "@app/Utils";
import "./styles.css";

// Create a Pixi Application
let app: PIXI.Application;

let score: PIXI.Text;
let scoreValue: number;
let blueBall: BlueBall;
let redBalls: RedBall[];
let gameOver: boolean;

function setup(): void {
  redBalls = [];
  gameOver = false;
  app.stage.interactive = true;

  // Generate first balls
  blueBall = new BlueBall(app);
  redBalls.push(new RedBall(app));

  // Initialize score
  scoreValue = 0;
  score = new PIXI.Text(String(scoreValue), {fill: "white"});
  score.x = app.renderer.width - 200;
  score.y = 50;
  app.stage.addChild(score);

  // Associate red ball spawn to click
  // @ts-ignore
  app.stage.click = () => {
    redBalls.push(new RedBall(app));
  };

  // Start game loop
  app.ticker.add((delta) => gameLoop(delta));
}

function startGame(): void {

  document.getElementsByClassName("post-game-menu")[0].setAttribute("style", "");
  app = new PIXI.Application({
    antialias: true,                    // default: false
    height: window.innerHeight,        // default: 600
    resolution: 1,                    // default: 1
    transparent: false,               // default: false
    width: window.innerWidth         // default: 800
  });
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
  app.loader.add("Blue Ball", "assets/img/Blue Ball.png")
            .add("Red Ball", "assets/img/Red Ball.png");
  if (document.getElementsByClassName("pre-game-menu").length > 0) {
    document.getElementsByClassName("pre-game-menu")[0].remove();
  }
  // Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);

  app.loader.load(setup);
}

function endGame(): void {
  document.getElementsByClassName("post-game-menu")[0].setAttribute("style", "display: flex");
  document.getElementsByClassName("score")[0].innerHTML = "Score: " + scoreValue.toFixed(0);
  app.destroy(true);
}

function gameLoop(delta: number): void {
  checkBlueBallCollision();
  if (!gameOver) {
    scoreValue += redBalls.length + delta;
    score.text = scoreValue.toFixed(0);
    redBalls.forEach((redBall) => redBall.execute(delta));
    blueBall.execute(delta);
  } else {
    app.ticker.stop();
    endGame();
  }
}

function checkBlueBallCollision(): void {
  redBalls.forEach((redBall) => {
    if (areBallsColliding(blueBall, redBall)) {
      gameOver = true;
    }
  });
}

// @ts-ignore
Array.from(document.getElementsByClassName("start")).forEach((element) => element.onclick = () => startGame());
