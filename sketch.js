//Declaring variables.
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  //Loading images and animations.
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  //Creating display screen.
  createCanvas(800, 400);

  //Crearting sprites.
  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,300)

  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  //score = 0;
  restart=createSprite(400,200,30,30);
  restart.addImage("restart",restartImg);
  restart.scale=0.2;

}

function draw() {
  //Adding a bakground to the screen.
  background(255);
  
  //Making the screen move with the kangaroo.
  kangaroo.x=camera.position.x-270;
   
  //Adding gameStates to the game.
  if (gameState===PLAY){

    restart.visible=false;

    //Changing the animation of the kangaroo while running.
    kangaroo.changeAnimation("running", kangaroo_running);

    //Giving velocity to the jungle so that it looks as the kangaroo is running in the forest.
    jungle.velocityX=-3;

    //Regenerating the jungle.
    if(jungle.x<100)
    {
       jungle.x=400
    }

   //console.log(kangaroo.y)

   //Making the kangaroo jump if the space key is pressed.
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    //Adding gravity to the game.
    kangaroo.velocityY = kangaroo.velocityY + 0.8

    //Function call.
    spawnShrubs();
    spawnObstacles();

    //Making the kangaroo stand on the ground.
    kangaroo.collide(invisibleGround);
    
    //Ending the game if kangaroo hits any stone.
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }

    //Making the kangaroo eat shrubs if it gets any near ot.
    if(shrubsGroup.isTouching(kangaroo)){
      score += 5;
      shrubsGroup.destroyEach();
    }

    console.log(gameState);
  }

  else if (gameState === END) {
    restart.visible=true;
    if(mousePressedOver(restart))
    {
      reset();
    }

    //set velcity of each game object to 0
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    //change the kangaroo animation to stop him if he hits any stone.
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  
  }

  //Displaying sprites on the screen.
  drawSprites();

  fill(0);
  textSize(20);
  text("Score: " + score, 50, 50);

}

function spawnShrubs() {
  //Creating shrubs.
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the shrub           
    shrub.scale = 0.05;
     //assign lifetime to the variable
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    //add each cloud to the group
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  //Creating stones.
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle           
 
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}

function reset()
{
  score = 0;
  gameState=PLAY;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
}