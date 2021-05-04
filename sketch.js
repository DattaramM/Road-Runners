// Global Variables

// Jake
var Jake, Jake_runningAnimation;

// Path
var path, pathImage;

// Coin
var coin, coinImage, coinsGroup;
// Energy Drink
var energyDrink, energyDrink_image, energyDrinks_group;

// Bomb
var bomb, bombImage, bombsGroup;

// Game Over
var gameOver, gameOver_image;

// Background Music
var backgroundMusic_sound;

// CheckPoint Sound
var checkPoint_sound;

// GameOver Sound
var gameOver_sound;

// Touching Sound
var touching_sound;

// PLAY State
var PLAY = 1;
// END State
var END = 0;
// Game State
var gameState = PLAY;

// Coins
var coins = 0;
// Highscore
var highscore = 0;
// HP
var HP = 100;

// Levels
var level = 1;

// edges
var edges;

// Left Invisible Boundary and Right Invisible Boundary
var invisibleBoundary_left, invisibleBoundary_right;

// preload function
function preload() {
  // loading Jake running animation
  Jake_runningAnimation = loadAnimation("images/jake-1.png", "images/jake-2.png","images/jake-3.png", "images/jake-4.png", 
  "images/jake-5.png");
  
  // loading path image
  pathImage = loadImage("images/path.png");
  
  // loading coin image
  coinImage = loadImage("images/coin.png");
  // loading energy drink image
  energyDrink_image = loadImage("images/energyDrink.png");
  
  bombImage = loadImage("images/bomb.png");
  
  // loading game over image
  gameOver_image = loadImage("images/gameOver.png");

  // Loading Background Music Sound
  backgroundMusic_sound = loadSound("sounds/backgroundMusic.mp3");

  // Loading check point sound
  checkPoint_sound = loadSound("sounds/checkPoint.mp3");

  // Loading game over sound
  gameOver_sound = loadSound("sounds/gameOver.mp3");

  // Loading touching sound
  touching_sound = loadSound("sounds/touch.mp3");
}

// setup function
function setup() {
  // creating canvas
  createCanvas(500, 500);
  
  // creating path sprite
  path = createSprite(250, 250);
  path.addImage(pathImage);
  path.scale = 1.6;
  
  // creating Jake sprite
  Jake = createSprite(250, 430, 20, 20);
  Jake.addAnimation("Jake Running", Jake_runningAnimation);
  //Jake.debug = true;
  Jake.debug = false;
  Jake.setCollider("rectangle", 0, 0, 75, 155);

  backgroundMusic_sound.loop();
  
  // creating left invisibleBoundary sprite(invisible boundary)
  invisibleBoundary_left = createSprite(0, 250, 86, 500);
  //invisibleBoundary_left.debug = true;
  invisibleBoundary_left.debug = false;
  //invisibleBoundary_left.visible = true;
  invisibleBoundary_left.visible = false;
  
  // creating right invisibleBoundary sprite(invisible boundary)
  invisibleBoundary_right = createSprite(500, 250, 70, 500);
  //invisibleBoundary_right.debug = true;
  invisibleBoundary_right.debug = false;
  //invisibleBoundary_right.visible = true;
  invisibleBoundary_right.visible = false;

  // creating gameOver sprite
  gameOver = createSprite(250, 250, 0, 0);
  gameOver.addImage(gameOver_image);
  gameOver.scale = 0.7;
  //gameOver.debug = true;
  gameOver.debug = false;
  //gameOver.visible = true;
  gameOver.visible = false;

  // creating edges as edgeSprites
  edges = createEdgeSprites();
  
  coinsGroup = new Group();
  energyDrinks_group = new Group();
  
  bombsGroup = new Group();
}

// draw function
function draw() {
  // setting background color of the canvas to black
  background("black");
  
  if (gameState === PLAY) {
    
    // calculating highscore
    highscore = highscore + Math.round(getFrameRate()/60);
    
    path.velocityY = (4 + 3 * highscore/200);
    
    // spawning coins
    createCoins();
    // spawning energy drinks
    createEnergyDrinks();
    
    // spawning bombs
    createBombs();
    
    // making the path infinitive on the screen
    if (path.y > 400) {
      path.y = height/2;
    }
    
    // setting the movement of the Jake using mouse's x position
    Jake.x = mouseX;
    
    // making the Jake collide with bottomEdge and invisibleBoundaries(invisible boundaries)
    Jake.collide(edges);
    Jake.collide(edges[0]);
    Jake.collide(edges[2]);
    Jake.collide(edges[3]);
    Jake.collide(invisibleBoundary_left);
    Jake.collide(invisibleBoundary_right);
    
    if (frameCount % 20 === 0) {
      HP = HP - 1;
    }
    
    if (Jake.isTouching(coinsGroup)) {
      coinsGroup.destroyEach();
      coins = coins + 1;
      console.info("Coin has been collected by Jake.");
      touching_sound.play();
    }
    
    if (Jake.isTouching(energyDrinks_group)) {
      energyDrinks_group.destroyEach();
      HP = HP + 20;
      console.info("Jake has taken energy drink and has boosted his HP.");
      touching_sound.play();
    }

    if (Jake.isTouching(bombsGroup)) {
      gameState = END;
      console.warn("Jake has touched bomb!");
      console.warn("Game Over!");
      window.alert("Game Over! Click OK.");
      window.alert("You touched the bomb! Click OK.");
      window.alert("Click on GAME OVER to play the game again. Click OK.");
      gameOver_sound.play();
    }
    
    if (HP === 0) {
      gameState = END;
      console.warn("Jake has 0 HP!");
      console.warn("Game Over!");
      window.alert("Game Over! Click OK.");
      window.alert("Your HP is 0! Click OK.");
      window.alert("Click on GAME OVER to play the game again. Click OK.");
      gameOver_sound.play();
    }

    if (HP === 10) {
      console.warn("Jake is running out of HP!");
    }

    if (highscore % 200 === 0 && highscore > 0) {
      level = level + 1;
      checkPoint_sound.play();
    }

    if (frameCount === 1) {
      console.info("The game has started.");
      window.alert("Click OK to play the game. Use headphones or earphones for the best experience");
    }
  } else if (gameState === END) {
    gameOver.visible = true;

    // destroying Jake
    Jake.destroy();

    path.velocityY = 0;

    // destroying coins
    coinsGroup.destroyEach();

    // destroying energy drinks
    energyDrinks_group.destroyEach();

    // destroying bombs
    bombsGroup.destroyEach();

    if (mousePressedOver(gameOver) || keyDown("space") || keyDown("up") || keyDown("r")) {
      reset();
      console.info("The game is played once again.");
    }
  }
  
  // drawSprites function to draw sprites(display sprites)
  drawSprites();
  
  // Displaying coins
  textSize(18);
  fill(255);
  text("Coins: " + coins, 50, 20);
  
  // Displaying Highscore
  textSize(18);
  fill(255);
  text("Highscore: " + highscore, 190, 20);
  
  // Displaying HP
  textSize(18);
  fill(255);
  text("HP: " + HP + " percent", 335, 20);

  // Displaying level
  text("Level: " + level, 220, 50);
  
  // Logging the gameState of the game in the console
  //console.log("The gameState is " + gameState);
  
  // Logging frameCount in the console
  //console.log(frameCount);
  
  // Logging the collider of Jake in the console
  //console.log(Jake.collider);

  // Logging y velocity of the path in the console
  //console.log(path.velocityY);
}

// create coins function
function createCoins() {
  if (frameCount % 110 === 0) {
    // creating coin
    coin = createSprite(Math.round(random(60, 435), 50, 10, 10));
    coin.addImage(coinImage);
    coin.scale = 0.3;
    coin.velocityY = (4 + highscore/200);
    coin.lifetime = 500 / coin.velocityY;
    coinsGroup.add(coin);
    //coin.debug = true;
    coin.debug = false;
    //console.log("Coin's y velocity => " + coin.velocityY);
  }
}

// create energy drinks function
function createEnergyDrinks() {
  if (frameCount % 500 === 0) {
    // creating energyDrink
    energyDrink = createSprite(Math.round(random(60, 435), 50, 10, 10));
    energyDrink.addImage(energyDrink_image);
    energyDrink.scale = 0.12;
    energyDrink.velocityY = (6 + highscore/200);
    energyDrink.lifetime = 500 / energyDrink.velocityY;
    energyDrinks_group.add(energyDrink);
    //energyDrink.debug = true;
    energyDrink.debug = false;
    // setting collider radius of energyDrink
    energyDrink.setCollider("rectangle", 0, 0, 225, 460);
    //console.log("EnergyDrink's y velocity => " + energyDrink.velocityY);
  }
}

//  create bombs function
function createBombs() {
  if (frameCount % 230 === 0) {
    // creating bomb
    bomb = createSprite(Math.round(random(60, 435), 50, 10, 10));
    bomb.addImage(bombImage);
    bomb.scale = 0.11;
    bomb.velocityY = (6 + highscore/200);
    bomb.lifetime = 500 / bomb.velocityY;
    bombsGroup.add(bomb);
    //bomb.debug = true;
    bomb.debug = false;
    //console.log("Bomb's y velocity => " + bomb.velocityY);
  }
}

// reset function
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  coinsGroup.destroyEach();
  energyDrinks_group.destroyEach();
  bombsGroup.destroyEach();
  Jake = createSprite(250, 430, 20, 20);
  Jake.addAnimation("Jake Running", Jake_runningAnimation);
  //Jake.debug = true;
  Jake.debug = false;
  coins = 0;
  highscore = 0;
  HP = 100;
  level = 1;
  path.velocityY = 4;
  if (path.y > height) {
    path.y = height/2;
  }
  console.count("Reset frame is called");
}
