var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');

var time = new Date();
time.setHours(time.getHours()-3);

time.setHours(time.getHours()-24);

client.on('connect', function() {  
  for(var i = 0; i < 1; i++){
  	var state;
  	if(i<20){
  		state = time.toISOString()+","+getRandomArbitrary(0,3).toFixed(1)+",85,1000";
  	}else if(i<40){
  		state = time.toISOString()+","+getRandomArbitrary(16,22).toFixed(1)+",85,1000";
  	}else{
  		state = time.toISOString()+","+getRandomArbitrary(0,4).toFixed(1)+",85,1000";
  	}
  	client.publish("tag/11:11:11:11:11:11/cc:cc:cc:cc:cc:cc", state);
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