var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');

var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

//time.setHours(time.getHours()-24);
var minutes = 0.5;
var delay = minutes * 60 * 1000;

client.on('connect', function() {
  console.log("MQTT connected");
  setInterval(function() {
    console.log('Post every ' + minutes + ' minutes.');
    var time = new Date();
    time.setHours(time.getHours()-3);
    var state = time.toISOString()+",";
    if(temperature){
      state = state + temperature.celsius.toFixed(1);
    }
    else{
      state = state + getRandomArbitrary(5,10).toFixed(1);
    }
  	state = state + ",-34.594113,-58.433810"; //Jufre 570, CABA
    //client.publish("gw/ab:ab:ab:ab:ab:ab", state)
    console.log(state);
  }, delay);
});

board.on("ready", function() {
  var temperature = new five.Thermometer({
    controller: "BMP180",
    freq: 250
  });

  temperature.on("change", function() {
    console.log("Temperature change celsius: ", this.celsius);
  });
});

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}