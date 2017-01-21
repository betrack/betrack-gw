var bmp085 = require('bmp085'),
    barometer = new bmp085();

var temp = parseFloat(process.env.BETRACK_TEMPERATURE);
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

var i2c = require('i2c');
var address = 0x77;
var wire = new i2c(address, {device: '/dev/i2c-1'}); // point to your i2c addre$

wire.scan(function(err, data) {
  if (err) {
    console.log(err);
  } 
  else if(data.length){
    // start the cycle
    readTemp();
  }
});