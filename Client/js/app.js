let app = new PIXI.Application({width: 400, height: 400, backgroundColor: 0x212121, antialias: true, resolution: 2});
var ip = location.host;
PIXI.settings.PRECISION_FRAGMENT = 'highp';
var Container = PIXI.Container;
var Sprite = PIXI.Sprite;
var resources = PIXI.loader.resources;
var loader = PIXI.loader;
var Graphics = PIXI.Graphics;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.roundPixels = true;
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);

gameOverContainer = new Container();
controlContainer = new Container();
startContainer = new Container();

statusText = new PIXI.Text("CONECTANDO A " + ip);
statusText.style.fill = 0x4374aa;
statusText.position.set(10, 10);
statusText.anchor.set(0, 0);
//app.stage.addChild(statusText);

forwardButton = new Graphics();
forwardButton.beginFill(0x00ff00);
forwardButton.drawCircle(0,0,40);
forwardButton.x = (window.innerWidth/5)*4
forwardButton.y = (window.innerHeight/2)-80;
forwardButton.endFill();
controlContainer.addChild(forwardButton);
forwardButton.interactive = true;
forwardButton.buttonMode = true;
forwardButton.on('pointerdown', emitForward);
forwardButton.on('pointerup', emitStopFeet);
forwardButton.on('pointerupoutside', emitStopFeet);
forwardText = new PIXI.Text("AVANZAR");
forwardText.style.fill = 0xffffff;
forwardText.position.set((window.innerWidth/5)*4, (window.innerHeight/2)-160);
forwardText.anchor.set(0.5, 0);
controlContainer.addChild(forwardText);

backwardButton = new Graphics();
backwardButton.beginFill(0xff0000);
backwardButton.drawCircle(0,0,40);
backwardButton.x = (window.innerWidth/5)*4
backwardButton.y = (window.innerHeight/2)+80;
backwardButton.endFill();
controlContainer.addChild(backwardButton);
backwardButton.interactive = true;
backwardButton.buttonMode = true;
backwardButton.on('pointerdown', emitBackward);
backwardButton.on('pointerup', emitStopFeet);
backwardButton.on('pointerupoutside', emitStopFeet);
backwardText = new PIXI.Text("RETROCEDER");
backwardText.style.fill = 0xffffff;
backwardText.position.set((window.innerWidth/5)*4, (window.innerHeight/2)+140);
backwardText.anchor.set(0.5, 0);
controlContainer.addChild(backwardText);

leftButton = new Graphics();
leftButton.beginFill(0x0000ff);
leftButton.drawCircle(0,0,40);
leftButton.x = 100;
leftButton.y = (window.innerHeight/2);
leftButton.endFill();
controlContainer.addChild(leftButton);
leftButton.interactive = true;
leftButton.buttonMode = true;
leftButton.on('pointerdown', emitLeft);
leftButton.on('pointerup', emitStopTurn);
leftButton.on('pointerupoutside', emitStopTurn);
leftText = new PIXI.Text("IZQUIERDA");
leftText.style.fill = 0xffffff;
leftText.position.set(100, (window.innerHeight/2)-80);
leftText.anchor.set(0.5, 0);
controlContainer.addChild(leftText);

rightButton = new Graphics();
rightButton.beginFill(0x0000ff);
rightButton.drawCircle(0,0,40);
rightButton.x = 350;
rightButton.y = (window.innerHeight/2);
rightButton.endFill();
controlContainer.addChild(rightButton);
rightButton.interactive = true;
rightButton.buttonMode = true;
rightButton.on('pointerdown', emitRight);
rightButton.on('pointerup', emitStopTurn);
rightButton.on('pointerupoutside', emitStopTurn);
rightText = new PIXI.Text("DERECHA");
rightText.style.fill = 0xffffff;
rightText.position.set(350, (window.innerHeight/2)-80);
rightText.anchor.set(0.5, 0);
controlContainer.addChild(rightText);

reloadButton = new Graphics();
reloadButton.beginFill(0x00ffff);
reloadButton.drawCircle(0,0,20);
reloadButton.x = (window.innerWidth)-40;
reloadButton.y = 40;
reloadButton.endFill();
app.stage.addChild(reloadButton);
reloadButton.interactive = true;
reloadButton.buttonMode = true;
reloadButton.on('pointertap', reload);

gameOverText = new PIXI.Text("GAME OVER");
gameOverText.style.fill = 0xff0000;
gameOverText.style.fontSize = "50px"
gameOverText.position.set((window.innerWidth)/2, 100);
gameOverText.anchor.set(0.5, 0);
gameOverContainer.addChild(gameOverText);

restartButton = new Graphics();
restartButton.beginFill(0x4374aa);
restartButton.drawRoundedRect((window.innerWidth/2)-150,window.innerHeight/2,300,40,5);
restartButton.endFill();
restartButton.interactive = true;
restartButton.buttonMode = true;
restartButton.on('pointertap', startGame);
gameOverContainer.addChild(restartButton);
restartText = new PIXI.Text("Jugar de nuevo");
restartText.style.fill= 0xffffff;
restartText.position.set(window.innerWidth/2,(window.innerHeight/2)+5);
restartText.anchor.set(0.5,0);
gameOverContainer.addChild(restartText);

startText = new PIXI.Text("ARMADILLO");
startText.style.fill = 0xffffff;
startText.style.fontSize = "5em";
startText.position.set((window.innerWidth)/2,30);
startText.anchor.set(0.5,0);
startContainer.addChild(startText);
startButton = new Graphics();
startButton.beginFill(0x00ff00);
startButton.drawRoundedRect((window.innerWidth/2)-150,window.innerHeight/2,300,40,5);
startButton.endFill();
startButton.interactive = true;
startButton.buttonMode = true;
startButton.on('pointertap', startGame);
startContainer.addChild(startButton);

app.stage.addChild(startContainer);

function showOverScreen(){
  app.stage.removeChild(controlContainer);
  app.stage.addChild(gameOverContainer);
}

function startGame(){
  app.stage.removeChild(gameOverContainer);
  app.stage.removeChild(startContainer);
  app.stage.addChild(controlContainer);

  socket.emit('START GAME');
}

function emitForward () {
  socket.emit('MOVE', 'FORWARD');
  console.log("Avanzando");
}

function emitBackward () {
  socket.emit('MOVE', 'BACKWARD');
  console.log("Retrocediendo");
}

function emitStopFeet(){
  socket.emit('STOP', 'FEET');
  console.log("Parando pies");
}

function emitLeft(){
  socket.emit('MOVE', 'LEFT');
  console.log("Doblando izquierda");
}

function emitRight(){
  socket.emit('MOVE', 'RIGHT');
  console.log("Doblando derecha");
}

function emitStopTurn(){
  socket.emit('STOP', 'FEET');
  console.log("Parando de doblar");
}

function reload(){
  location.reload();
}

//Abrir el socket
var socket = io('http://' + ip + ':3000');

socket.on('connect', () => {
  statusText.style.fill = 0xffffff;
  statusText.text = "CONECTADO!";
  console.log("Conectado al socket");
});

socket.on('GAME OVER', () => {
  console.log("GAME OVER!!!");
  showOverScreen();
});

socket.on('connect_error', (error) => {
  console.log("CONNECT ERROR");
  console.log(error);
  alert("Error de conexión!")
});
