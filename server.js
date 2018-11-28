const Server = require('socket.io');
const Gpio = require('pigpio').Gpio;
const NanoTimer = require('nanotimer');
const lineSensor = new Gpio(27, {mode: Gpio.INPUT});
const motorLeft = new Gpio(17, {mode: Gpio.OUTPUT});
const motorRight = new Gpio(18, {mode: Gpio.OUTPUT});
var timer = new NanoTimer();
var lineStatus;
var whiteCounter = 0;
var gameOver = false;

function sleep(tm) {
  return new Promise(resolve => timer.setTimeout(resolve, '', tm));
}

const io = new Server();
io.attach(3000);

io.on('connection', (socket) => {
  socket.join('Armadillo', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms);
  });

  setInterval(readLine, 50);
  socket.on('MOVE', (data) => {
    if (data == "FORWARD"){
      motorLeft.servoWrite(1000);
      motorRight.servoWrite(2000);
    }
    if (data == "BACKWARD"){
      motorLeft.servoWrite(2000);
      motorRight.servoWrite(1000);
    }
    if (data == "LEFT"){
      motorLeft.servoWrite(1000);
      motorRight.servoWrite(0);
    }
    if (data == "RIGHT"){
      motorRight.servoWrite(1000);
      motorLeft.servoWrite(0);
    }
    console.log(data);
  });

  socket.on('STOP', (data)=> {
    if (data == "FEET"){
      motorLeft.servoWrite(0);
      motorRight.servoWrite(0);
      console.log("STOP FEET");
    }
  });
  socket.on('START GAME', ()=>{
    gameOver = false;
  })
});

async function readLine(){
  lineSensor.mode(Gpio.OUTPUT);
  lineSensor.digitalWrite(1);
  lineSensor.mode(Gpio.INPUT);
  await sleep('80u');
  lineStatus = lineSensor.digitalRead();
  console.log(lineStatus);
  if (lineStatus == 0){
    whiteCounter = whiteCounter + 1;
  }
  else if (lineStatus == 1){
    whiteCounter = 0;
  }

  if (whiteCounter >= 10){
    if (gameOver == false){
      //gameOver = true;
      //console.log("GAME OVER!!");
      //io.sockets.emit('GAME OVER');
      //motorFront.servoWrite(0);
      //motorBack.servoWrite(0);
      //motorTurn.servoWrite(1180);
    }
  }

}
