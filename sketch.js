var START = 0;
var INSTRUCTIONS = 1;
var PLAY = 2;
var END = 3;

var groundImg, backgroundImg, playImg, menuImg, instructionbuttonImg, resetImg;

gamestate = START;


var monkey , monkey_running;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var score = 0;
var ground, ground2, backgroundi;
var play, instructionbutton, menu, resetb;
var survivalTime;
var timer = 0;

var beginningx;
var beginningy;
var beginningz;

var beginningx2;
var beginningy2;
var beginningz2;

var easing = 0.05;

function preload(){ 
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  backgroundImg = loadImage("monkeybackground.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  groundImg = loadImage("monkeyground.png");
  playImg = loadImage("playbutton.png");
  instructionbuttonImg = loadImage("instructionsbutton.png");
  menuImg = loadImage("menubutton.png");
  resetImg = loadImage("resetimg.png");
}



function setup() {
  createCanvas(500, 400)
  backgroundi = createSprite(230, 200);
  backgroundi.addImage(backgroundImg);
  backgroundi.scale = 2.1;
  ground = createSprite(300, 380);
  ground.addImage(groundImg);
  ground2 = createSprite(50, 315, 500, 10);
  ground2.visible = false;
  monkey = createSprite(50, 280);
  monkey.addAnimation("sprite_0.png", monkey_running);
  monkey.scale = 0.1;
  obstacleGroup = new Group();
  bananaGroup = new Group();
  monkey.visible = false;
  play = createSprite(250, 150);
  play.addImage(playImg);
  play.scale = 0.1;
  instructionsbutton = createSprite(250, 200);
  instructionsbutton.addImage(instructionbuttonImg);
  instructionsbutton.scale = 0.15;
  menu = createSprite(80, 360);
  menu.addImage(menuImg);
  menu.scale = 0.1;
  resetb = createSprite(230, 310);
  resetb.addImage(resetImg);
  resetb.scale = 0.2;
  resetb.visible = false;
  
  beginningx2 = monkey.x;
  beginningy2 = monkey.y;
  beginningz2 = 1;
}


function draw() {
  background("white");
  drawSprites();
  timer -= 1;
  if (timer <= 0) {
    let TargetX2 = width / 2;
    let dx2 = TargetX2 - beginningx2;
    beginningx2 += dx2 * easing;

    let TargetY2 = height / 2;
    let dy2 = TargetY2 - beginningy2;
    beginningy2 += dy2 * easing;

    let TargetZ2 = 1;
    let dz2 = TargetZ2 - beginningz2;
    beginningz2 += dz2 * easing;

    camera.zoom = beginningz2;
    camera.position.x = beginningx2;
    camera.position.y = beginningy2;
  }
  else {
    let TargetX = monkey.x;
    let dx = TargetX - beginningx;
    beginningx += dx * easing;

    let TargetY = monkey.y;
    let dy = TargetY - beginningy;
    beginningy += dy * easing;

    let TargetZ = 2;
    let dz = TargetZ - beginningz;
    beginningz += dz * easing;

    camera.position.x = beginningx;
    camera.position.y = beginningy;
    camera.zoom = beginningz;
  }
  monkey.collide(ground2);
  monkey.velocityY += 0.8;
  if (gamestate === START) {
    textSize(40);
    fill("black");
    text("MONKEY RUNNER", 60, 50);
    menu.visible = false;
    monkey.visible = false;
    play.visible = true;
    instructionsbutton.visible = true;
  }
  if (mousePressedOver(play) && gamestate === START) {
    gamestate = PLAY;
    reset();
  }
  if (mousePressedOver(instructionsbutton)) {
    gamestate = INSTRUCTIONS;
  }
  if (gamestate === INSTRUCTIONS) {
    menu.visible = true;
    play.visible = false;
    instructionsbutton.visible = false;
    textSize(20);
    fill("black");
    text("Press space to jump", 180, 80);
    text("Collect bananas to increase your score", 70, 120);
    text("Avoid the rocks", 190, 160);
    text("Get as far as you can", 170, 200);
    text("It will get harder as you go on", 130, 240);
  }
  if (mousePressedOver(menu)) {
    gamestate = START;
    
  }
  if (gamestate === PLAY) {
    play.visible = false;
    instructionsbutton.visible = false;
    ground.velocityX = -7 - score / 3;
    if (ground.x < 100) {
      ground.x = 250;
    }
    backgroundi.velocityX = -3.5 - score / 3;
    if (backgroundi.x < 110) {
      backgroundi.x = 250;
    }
    fill("black");
    textSize(22);
    text("Score: " + score, 400, 30);
    fill("black");
    textSize(22);
    survivalTime = Math.ceil(frameCount/frameRate());
    text("Survival Time: " + survivalTime, 120, 30);
    spawnObstacles();
    spawnBananas();
    if (keyDown("space") && monkey.y > 279) {
        monkey.velocityY = -13;
        beginningx = width / 2;
        beginningy = height / 2;
        beginningz = 1;

        beginningx2 = monkey.x;
        beginningy2 = monkey.y;
        beginningz2 = 2;

        timer = 40;
    }
    if (bananaGroup.isTouching(monkey)) {
      score += 1;
      bananaGroup.destroyEach();
    }
    //console.log(monkey.y);
  }
  if (gamestate === PLAY && obstacleGroup.isTouching(monkey)) {
    gamestate = END;
    
  }
  if (gamestate === END) {
    backgroundi.velocityX = 0;
    ground.velocityX = 0;
    obstacleGroup.destroyEach();
    bananaGroup.destroyEach();
    monkey.visible = false;
    resetb.visible = true;
    textSize(30);
    fill("black");
    text("GAME OVER", 140, 200);
    textSize(25);
    text("Score: " + score, 180, 240);
    text("Survival Time: " + survivalTime, 145, 155);
  }
  if (gamestate === END && mousePressedOver(resetb)) {
    reset();
    gamestate = PLAY;
  }
}

function spawnObstacles() {
  if (World.frameCount % 103 === 0) {
    obstacle = createSprite(500, 280);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -7 - score / 3;
    obstacle.scale = random(0.1, 0.3);
    obstacle.lifetime = 200;
    obstacleGroup.add(obstacle);
    obstacle.setCollider("circle", 0, 0, 120);
  }  
}
function spawnBananas() {
  if (World.frameCount % 100 === 0) {
    banana = createSprite(500, random(172, 270));
    banana.addImage(bananaImage);
    banana.velocityX = (-7 - score / 3);
    banana.scale = 0.08;
    banana.lifetime = 200;
    bananaGroup.add(banana);
  }
}
function reset() {
  resetb.visible = false;
  score = 0;
  survivalTime = 0;
  frameCount = 0;
  monkey.visible = true;
}


