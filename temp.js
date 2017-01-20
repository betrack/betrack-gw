var bmp085 = require('bmp085'),
    barometer = new bmp085();

var temp = 20.0;
exports.temp = temp;

var jsonfile = require('jsonfile');
const file = "/data/temp.json";
jsonfile.readFile(file, function(err, obj) {
  if(!err){
    temp = obj.temp;
    exports.temp = temp;
  }
});

var TEMPminutes = 1;
function readTemp(){
  barometer.read(function (data) {
    console.log("Temperature:", data.temperature);
    temp = data.temperature;
    exports.temp = temp;
    var json = {temp: temp};
    jsonfile.writeFile(file,json,function(err){
      if(err)
        console.error(err);
    });
    setTimeout(readTemp, TEMPminutes * 60 * 1000);
  });
}

var rasp2c = require('rasp2c');
 
// Detect devices on the I2C Bus 
rasp2c.detect(function(err, result) {
  if (err) {
    console.log(err);
  } else {
    // start the cycle
    readTemp();
  }
});