var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');


//time.setHours(time.getHours()-24);
var minutes = 0.5;
var delay = minutes * 60 * 1000;

client.on('connect', function() {
  console.log("MQTT connected");
  setInterval(function() {
    console.log('Post every ' + minutes + ' minutes.');
    var time = new Date();
    time.setHours(time.getHours()-3);  
  	var state = time.toISOString()+","+getRandomArbitrary(5,10).toFixed(1)+",-34.594113,-58.433810"; //Jufre 570, CABA
    //client.publish("gw/ab:ab:ab:ab:ab:ab", state)
    console.log(state);
  }, delay);
});

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}