var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');

var time = new Date();
time.setHours(time.getHours()-3);

//time.setHours(time.getHours()-24);

client.on('connect', function() {  
  for(var i = 0; i < 1; i++){
  	var state = time.toISOString()+","+getRandomArbitrary(5,10).toFixed(1)+","+getRandomArbitrary(-34.576196,-34.5762).toFixed(6)+","+getRandomArbitrary(-58.511053,-58.513053).toFixed(6);
    client.publish("gw/ab:ab:ab:ab:ab:ab", state)
    //var state = time.toISOString()+","+getRandomArbitrary(5,10).toFixed(1)+","+getRandomArbitrary(-34.592194,-34.592194).toFixed(6)+","+getRandomArbitrary(-58.440766,-58.440766).toFixed(6);
    //client.publish("gw/de:de:de:de:de:de", state)
    console.log(state);
  	wait(100);
  	time.setMinutes(time.getMinutes()+30);
  }
});

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}